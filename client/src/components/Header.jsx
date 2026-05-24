import React from "react";

const s = {
  header: {
    display: "flex", alignItems: "center", justifyContent: "space-between",
    padding: "0 20px", height: "58px",
    background: "var(--surface)", borderBottom: "1px solid var(--border)",
    flexShrink: 0, zIndex: 100,
  },
  left: { display: "flex", alignItems: "center", gap: "12px" },
  hex: {
    width: "30px", height: "30px",
    background: "var(--accent)",
    clipPath: "polygon(50% 0%,100% 25%,100% 75%,50% 100%,0% 75%,0% 25%)",
    animation: "pulse 2s infinite",
  },
  logo: {
    fontFamily: "var(--font-display)", fontWeight: 800,
    fontSize: "20px", letterSpacing: "2px", textTransform: "uppercase",
  },
  logoSpan: { color: "var(--accent)" },
  sub: {
    fontFamily: "var(--font-mono)", fontSize: "9px",
    color: "var(--muted)", letterSpacing: "1px",
  },
  stats: { display: "flex", gap: "24px" },
  stat: { textAlign: "center" },
  statVal: { fontFamily: "var(--font-mono)", fontSize: "20px", fontWeight: 700, display: "block" },
  statLbl: { fontFamily: "var(--font-mono)", fontSize: "8px", color: "var(--muted)", letterSpacing: "1px", textTransform: "uppercase" },
  btn: {
    background: "var(--accent)", color: "white", border: "none",
    padding: "8px 18px",
    fontFamily: "var(--font-display)", fontWeight: 700,
    fontSize: "13px", letterSpacing: "1px", textTransform: "uppercase",
    cursor: "pointer",
    clipPath: "polygon(6px 0%,100% 0%,calc(100% - 6px) 100%,0% 100%)",
    transition: "background .2s",
  },
};

export default function Header({ stats, onNewReport }) {
  return (
    <header style={s.header}>
      <div style={s.left}>
        <div style={s.hex} />
        <div>
          <div style={s.logo}><span style={s.logoSpan}>Alerta</span>Barrio</div>
          <div style={s.sub}>LIMA · PLATAFORMA CIUDADANA DE SEGURIDAD</div>
        </div>
      </div>

      <div style={s.stats}>
        <div style={s.stat}>
          <span style={{ ...s.statVal, color: "var(--accent)" }}>{stats.total ?? 0}</span>
          <span style={s.statLbl}>Reportes</span>
        </div>
        <div style={s.stat}>
          <span style={{ ...s.statVal, color: "var(--accent2)" }}>{stats.today ?? 0}</span>
          <span style={s.statLbl}>Hoy</span>
        </div>
        <div style={s.stat}>
          <span style={{ ...s.statVal, color: "var(--accent3)" }}>5</span>
          <span style={s.statLbl}>Zonas</span>
        </div>
      </div>

      <button
        style={s.btn}
        onClick={onNewReport}
        onMouseEnter={(e) => (e.target.style.background = "#ff6060")}
        onMouseLeave={(e) => (e.target.style.background = "var(--accent)")}
      >
        + Nuevo reporte
      </button>
    </header>
  );
}
