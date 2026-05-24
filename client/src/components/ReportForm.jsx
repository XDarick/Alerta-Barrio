import React, { useState, useRef } from "react";
import { CAT_NAMES, LIMA } from "../utils/constants.js";
import { createReport, classifyWithAI, searchPlace } from "../utils/api.js";

const CATS = ["emergencia", "zona_roja", "extorsion", "robo"];

const CAT_LABELS = {
  emergencia: "Emergencia",
  zona_roja:  "Zona Roja",
  extorsion:  "Extorsión",
  robo:       "Robo",
};

const s = {
  wrap: { padding: "16px", display: "flex", flexDirection: "column", gap: "12px", overflowY: "auto" },
  title: { fontSize: "16px", fontWeight: 800, letterSpacing: "2px", textTransform: "uppercase", color: "var(--accent)" },
  label: { fontSize: "9px", fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase", color: "var(--muted)", marginBottom: "4px", display: "block" },
  catGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6px" },
  catBtn: {
    background: "var(--surface2)", border: "1px solid var(--border)",
    color: "var(--muted)", padding: "10px 8px",
    fontFamily: "var(--font-display)", fontSize: "13px", fontWeight: 700,
    letterSpacing: "1px", textTransform: "uppercase", cursor: "pointer",
    transition: ".2s", textAlign: "center",
  },
  catBtnSel: { borderColor: "var(--accent)", color: "var(--text)", background: "rgba(255,59,59,.08)" },
  textarea: {
    background: "var(--surface2)", border: "1px solid var(--border)",
    color: "var(--text)", padding: "10px", fontFamily: "var(--font-mono)",
    fontSize: "12px", width: "100%", minHeight: "80px", resize: "vertical", outline: "none",
  },
  searchWrap: { position: "relative" },
  searchRow: { display: "flex", gap: "0" },
  searchInput: {
    flex: 1, background: "var(--surface2)", border: "1px solid var(--border)",
    borderRight: "none", color: "var(--text)", padding: "9px 12px",
    fontFamily: "var(--font-mono)", fontSize: "11px", outline: "none",
  },
  searchBtn: {
    background: "var(--surface2)", border: "1px solid var(--border)",
    color: "var(--accent3)", padding: "9px 14px",
    fontFamily: "var(--font-mono)", fontSize: "13px",
    cursor: "pointer", transition: ".2s", flexShrink: 0,
  },
  dropdown: {
    position: "absolute", top: "100%", left: 0, right: 0, zIndex: 999,
    background: "var(--surface)", border: "1px solid var(--border)",
    borderTop: "none", maxHeight: "180px", overflowY: "auto",
  },
  dropItem: {
    padding: "9px 12px", fontFamily: "var(--font-mono)", fontSize: "10px",
    color: "var(--text)", cursor: "pointer", borderBottom: "1px solid var(--border)",
    transition: "background .15s",
  },
  locConfirm: {
    background: "var(--surface2)", border: "1px solid var(--accent3)",
    padding: "8px 10px", fontFamily: "var(--font-mono)", fontSize: "10px",
    color: "var(--accent3)",
  },
  locRow: { display: "flex", gap: "6px" },
  gpsBtn: {
    background: "none", border: "1px solid var(--border)", color: "var(--muted)",
    padding: "7px 10px", fontFamily: "var(--font-mono)", fontSize: "10px",
    cursor: "pointer", transition: ".2s", whiteSpace: "nowrap",
  },
  aiBox: {
    background: "var(--surface2)", border: "1px solid var(--border)",
    borderLeft: "3px solid var(--accent3)", padding: "10px 12px",
    fontFamily: "var(--font-mono)", fontSize: "10px",
    display: "flex", flexDirection: "column", gap: "4px",
  },
  aiTitle: { color: "var(--accent3)", fontWeight: 700, fontSize: "9px", letterSpacing: "1px", textTransform: "uppercase" },
  submitBtn: {
    background: "var(--accent)", color: "white", border: "none",
    padding: "12px", fontFamily: "var(--font-display)", fontWeight: 800,
    fontSize: "14px", letterSpacing: "2px", textTransform: "uppercase",
    cursor: "pointer", width: "100%", transition: ".2s",
  },
};

export default function ReportForm({ clickedLatLng, onReportAdded }) {
  const [cat, setCat] = useState(null);
  const [desc, setDesc] = useState("");
  const [lat, setLat] = useState(null);
  const [lng, setLng] = useState(null);
  const [addrLabel, setAddrLabel] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [aiResult, setAiResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const searchRef = useRef(null);

  React.useEffect(() => {
    if (clickedLatLng) {
      setLat(clickedLatLng.lat);
      setLng(clickedLatLng.lng);
      setAddrLabel(`${clickedLatLng.lat.toFixed(4)}, ${clickedLatLng.lng.toFixed(4)}`);
      setSearchQuery("");
      setSearchResults([]);
    }
  }, [clickedLatLng]);

  async function handleSearch() {
    if (!searchQuery.trim()) return;
    setSearching(true);
    try {
      const results = await searchPlace(searchQuery);
      setSearchResults(results);
    } catch {
      setSearchResults([]);
    }
    setSearching(false);
  }

  function handleKeyDown(e) {
    if (e.key === "Enter") handleSearch();
  }

  function selectPlace(place) {
    setLat(parseFloat(place.lat));
    setLng(parseFloat(place.lon));
    setAddrLabel(place.display_name.split(",").slice(0, 3).join(", "));
    setSearchQuery(place.display_name.split(",")[0]);
    setSearchResults([]);
  }

  function getGPS() {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (p) => {
        setLat(p.coords.latitude);
        setLng(p.coords.longitude);
        setAddrLabel(`${p.coords.latitude.toFixed(4)}, ${p.coords.longitude.toFixed(4)}`);
      },
      () => {
        const fallLat = LIMA[0] + (Math.random() - .5) * .03;
        const fallLng = LIMA[1] + (Math.random() - .5) * .03;
        setLat(fallLat); setLng(fallLng);
        setAddrLabel(`${fallLat.toFixed(4)}, ${fallLng.toFixed(4)}`);
      }
    );
  }

  async function handleSubmit() {
    if (!cat || !desc.trim()) return;
    setLoading(true);
    const ai = await classifyWithAI(cat, desc);
    setAiResult(ai);
    const report = await createReport({
      cat, desc,
      lat: lat || LIMA[0] + (Math.random() - .5) * .04,
      lng: lng || LIMA[1] + (Math.random() - .5) * .04,
      addr: addrLabel || "Lima, Perú",
      entidad: ai.entidad,
      urgencia: ai.urgencia,
    });
    setLoading(false);
    onReportAdded(report);
    setCat(null); setDesc(""); setLat(null); setLng(null);
    setAddrLabel(""); setSearchQuery(""); setAiResult(null);
  }

  return (
    <div style={s.wrap}>
      <div style={s.title}>Nuevo reporte</div>

      {/* Category */}
      <div>
        <span style={s.label}>Tipo de incidente</span>
        <div style={s.catGrid}>
          {CATS.map((c) => (
            <button
              key={c}
              style={{ ...s.catBtn, ...(cat === c ? s.catBtnSel : {}) }}
              onClick={() => setCat(c)}
            >
              {CAT_LABELS[c]}
            </button>
          ))}
        </div>
      </div>

      {/* Description */}
      <div>
        <span style={s.label}>Descripcion del incidente</span>
        <textarea
          style={s.textarea}
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
          placeholder="Describe con detalle lo que ocurre..."
          onFocus={(e) => (e.target.style.borderColor = "var(--accent)")}
          onBlur={(e) => (e.target.style.borderColor = "var(--border)")}
        />
      </div>

      {/* Location search */}
      <div>
        <span style={s.label}>Ubicacion</span>
        <div style={s.searchWrap} ref={searchRef}>
          <div style={s.searchRow}>
            <input
              style={s.searchInput}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Buscar calle, avenida, lugar..."
              onFocus={(e) => (e.target.style.borderColor = "var(--accent3)")}
              onBlur={(e) => (e.target.style.borderColor = "var(--border)")}
            />
            <button
              style={s.searchBtn}
              onClick={handleSearch}
              onMouseEnter={(e) => (e.target.style.background = "rgba(0,212,170,.1)")}
              onMouseLeave={(e) => (e.target.style.background = "var(--surface2)")}
            >
              {searching ? "..." : "&#128269;"}
            </button>
          </div>

          {searchResults.length > 0 && (
            <div style={s.dropdown}>
              {searchResults.map((r) => (
                <div
                  key={r.place_id}
                  style={s.dropItem}
                  onClick={() => selectPlace(r)}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "var(--surface2)")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                >
                  {r.display_name.split(",").slice(0, 3).join(", ")}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* GPS fallback + confirmed location */}
        <div style={{ ...s.locRow, marginTop: "6px" }}>
          <button
            style={s.gpsBtn}
            onClick={getGPS}
            onMouseEnter={(e) => { e.target.style.borderColor = "var(--accent3)"; e.target.style.color = "var(--accent3)"; }}
            onMouseLeave={(e) => { e.target.style.borderColor = "var(--border)"; e.target.style.color = "var(--muted)"; }}
          >
            Usar GPS
          </button>
          {addrLabel && (
            <div style={s.locConfirm}>
              Ubicacion: {addrLabel}
            </div>
          )}
        </div>
        {!addrLabel && (
          <div style={{ fontFamily: "var(--font-mono)", fontSize: "9px", color: "var(--muted)", marginTop: "4px" }}>
            O haz click directamente en el mapa
          </div>
        )}
      </div>

      {/* AI result */}
      {aiResult && (
        <div style={s.aiBox}>
          <div style={s.aiTitle}>Analisis IA</div>
          <div>Autoridad: <span style={{ color: "var(--accent2)", fontWeight: 700 }}>{aiResult.entidad}</span></div>
          <div>Urgencia: <span style={{ color: aiResult.urgencia === "alta" ? "var(--accent)" : aiResult.urgencia === "media" ? "var(--accent2)" : "var(--accent3)", fontWeight: 700 }}>{aiResult.urgencia?.toUpperCase()}</span></div>
          <div style={{ color: "var(--muted)" }}>{aiResult.sugerencia}</div>
        </div>
      )}

      <button
        style={{ ...s.submitBtn, background: loading ? "var(--muted)" : "var(--accent)", cursor: loading ? "not-allowed" : "pointer" }}
        onClick={handleSubmit}
        disabled={loading || !cat || !desc.trim()}
        onMouseEnter={(e) => { if (!loading) e.target.style.background = "#ff6060"; }}
        onMouseLeave={(e) => { if (!loading) e.target.style.background = "var(--accent)"; }}
      >
        {loading ? "Analizando..." : "Enviar reporte"}
      </button>
    </div>
  );
}
