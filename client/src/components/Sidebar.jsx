import React, { useState } from "react";
import ReportCard from "./ReportCard.jsx";
import ReportForm from "./ReportForm.jsx";

const s = {
  sidebar: {
    width: "320px", background: "var(--surface)",
    borderLeft: "1px solid var(--border)",
    display: "flex", flexDirection: "column", overflow: "hidden",
  },
  tabs: { display: "flex", borderBottom: "1px solid var(--border)", flexShrink: 0 },
  tab: {
    flex: 1, padding: "11px", textAlign: "center", cursor: "pointer",
    fontFamily: "var(--font-display)", fontSize: "11px", fontWeight: 700,
    letterSpacing: "1px", textTransform: "uppercase",
    color: "var(--muted)", transition: ".2s",
    borderBottom: "2px solid transparent",
  },
  tabActive: { color: "var(--text)", borderBottomColor: "var(--accent)" },
  content: { flex: 1, overflow: "hidden", display: "flex", flexDirection: "column" },
  feed: { flex: 1, overflowY: "auto", padding: "10px", display: "flex", flexDirection: "column", gap: "8px" },
  empty: {
    padding: "40px 20px", textAlign: "center",
    fontFamily: "var(--font-mono)", fontSize: "11px", color: "var(--muted)",
  },
};

export default function Sidebar({ reports, selectedId, onCardClick, onReportAdded, clickedLatLng, activeTab, onTabChange }) {
  return (
    <div style={s.sidebar}>
      <div style={s.tabs}>
        {["feed", "reportar"].map((t) => (
          <div
            key={t}
            style={{ ...s.tab, ...(activeTab === t ? s.tabActive : {}) }}
            onClick={() => onTabChange(t)}
          >
            {t === "feed" ? "📋 Feed" : "+ Reportar"}
          </div>
        ))}
      </div>

      <div style={s.content}>
        {activeTab === "feed" ? (
          <div style={s.feed}>
            {reports.length === 0 ? (
              <div style={s.empty}>No hay reportes aún.<br />¡Sé el primero en reportar!</div>
            ) : (
              reports.map((r) => (
                <ReportCard
                  key={r.id}
                  report={r}
                  isSelected={r.id === selectedId}
                  onClick={() => onCardClick(r)}
                  onVoted={(id, votes) => {
                    // bubble up handled in App
                  }}
                />
              ))
            )}
          </div>
        ) : (
          <ReportForm clickedLatLng={clickedLatLng} onReportAdded={onReportAdded} />
        )}
      </div>
    </div>
  );
}
