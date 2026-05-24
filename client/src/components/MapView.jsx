import React, { useEffect, useRef } from "react";
import { LIMA, CAT_COLORS, CAT_NAMES, timeAgo } from "../utils/constants.js";

export default function MapView({ reports, onMapClick, selectedId }) {
  const mapRef = useRef(null);
  const leafletRef = useRef(null);
  const markersRef = useRef([]);

  useEffect(() => {
    if (leafletRef.current) return;
    const L = window.L;
    const map = L.map(mapRef.current, { zoomControl: false }).setView(LIMA, 13);
    L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
      attribution: "© OSM © Carto", maxZoom: 19,
    }).addTo(map);
    L.control.zoom({ position: "bottomleft" }).addTo(map);
    map.on("click", (e) => onMapClick(e.latlng.lat, e.latlng.lng));
    leafletRef.current = map;
  }, []);

  useEffect(() => {
    const L = window.L;
    const map = leafletRef.current;
    if (!map || !L) return;

    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];

    reports.forEach((r) => {
      const col = CAT_COLORS[r.cat] || "#8888ff";
      const isSelected = r.id === selectedId;
      const icon = L.divIcon({
        className: "",
        html: `<div style="width:${isSelected ? 18 : 13}px;height:${isSelected ? 18 : 13}px;background:${col};border-radius:50%;border:2px solid ${isSelected ? "#fff" : "rgba(255,255,255,0.5)"};box-shadow:0 0 ${isSelected ? 12 : 6}px ${col}88;transition:all .3s"></div>`,
        iconSize: [18, 18], iconAnchor: [9, 9],
      });
      const m = L.marker([r.lat, r.lng], { icon }).addTo(map);
      m.bindPopup(`
        <div style="background:#13131a;color:#f0f0f5;padding:12px;font-family:'Space Mono',monospace;font-size:11px;border:1px solid #2a2a3a;min-width:190px;border-radius:2px">
          <b style="color:${col}">${CAT_NAMES[r.cat]}</b><br>
          <span style="color:#aaa;font-size:9px">${r.addr}</span><br><br>
          ${r.desc}<br><br>
          <span style="color:#00d4aa;font-size:9px">→ ${r.entidad}</span><br>
          <span style="color:#6b6b80;font-size:9px">${timeAgo(r.createdAt)} · ${r.votes} votos</span>
        </div>`, { className: "dark-popup" });
      markersRef.current.push(m);
    });
  }, [reports, selectedId]);

  return (
    <div style={{ flex: 1, position: "relative" }}>
      <div ref={mapRef} style={{ width: "100%", height: "100%" }} />
      <div style={{
        position: "absolute", top: 12, left: 12, zIndex: 500,
        background: "rgba(10,10,15,0.85)", border: "1px solid var(--border)",
        padding: "6px 12px", fontFamily: "var(--font-mono)", fontSize: "10px",
        color: "var(--muted)", backdropFilter: "blur(4px)",
      }}>
        LIMA, PERÚ &nbsp;|&nbsp; <span style={{ color: "var(--accent3)" }}>Click en el mapa para ubicar</span>
      </div>
    </div>
  );
}
