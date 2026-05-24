import React from "react";
import { CAT_COLORS, CAT_NAMES, timeAgo } from "../utils/constants.js";
import { voteReport } from "../utils/api.js";

const s = {
  card: {
    background:"var(--surface2)", border:"1px solid var(--border)",
    padding:"12px 14px", cursor:"pointer",
    transition:"border-color .2s, transform .15s",
    position:"relative", overflow:"hidden",
  },
  stripe:{ position:"absolute", left:0, top:0, bottom:0, width:"3px" },
  top:{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"6px" },
  catBadge:{ fontSize:"9px", fontWeight:700, letterSpacing:"1px", textTransform:"uppercase", padding:"2px 8px" },
  time:{ fontFamily:"var(--font-mono)", fontSize:"9px", color:"var(--muted)" },
  desc:{ fontSize:"13px", color:"var(--text)", lineHeight:1.4, marginBottom:"6px" },
  addr:{ fontFamily:"var(--font-mono)", fontSize:"9px", color:"var(--muted)", marginBottom:"6px" },
  ai:{ display:"flex", alignItems:"center", gap:"4px", fontSize:"9px", fontFamily:"var(--font-mono)", color:"var(--accent3)", marginBottom:"6px" },
  dot:{ width:"5px", height:"5px", background:"var(--accent3)", borderRadius:"50%", animation:"blink 1.5s infinite" },
  bottom:{ display:"flex", gap:"8px", alignItems:"center" },
  voteBtn:{
    background:"none", border:"1px solid var(--border)", color:"var(--muted)",
    fontFamily:"var(--font-mono)", fontSize:"10px", padding:"2px 8px",
    cursor:"pointer", transition:"border-color .2s, color .2s",
  },
  urgBadge:{ fontSize:"9px", fontFamily:"var(--font-mono)", padding:"2px 6px" },
};

const URGENCIA_STYLE = {
  alta:  { background:"rgba(255,59,59,.15)",  color:"#ff3b3b" },
  media: { background:"rgba(255,140,0,.15)",  color:"#ff8c00" },
  baja:  { background:"rgba(0,212,170,.15)",  color:"#00d4aa" },
};

export default function ReportCard({ report, onClick, isSelected, onVoted }) {
  const col = CAT_COLORS[report.cat] || "#8888ff";

  async function handleVote(e) {
    e.stopPropagation();
    const data = await voteReport(report.id);
    if (data.votes !== undefined) onVoted(report.id, data.votes);
  }

  return (
    <div
      style={{ ...s.card, borderColor:isSelected ? col : "var(--border)", transform:isSelected ? "translateX(4px)" : "none" }}
      onClick={onClick}
      onMouseEnter={(e) => { if (!isSelected) e.currentTarget.style.borderColor = col; }}
      onMouseLeave={(e) => { if (!isSelected) e.currentTarget.style.borderColor = "var(--border)"; }}
    >
      <div style={{ ...s.stripe, background:col }} />
      <div style={s.top}>
        <span style={{ ...s.catBadge, background:`${col}22`, color:col }}>{CAT_NAMES[report.cat]}</span>
        <span style={s.time}>{timeAgo(report.createdAt)}</span>
      </div>
      <div style={s.desc}>{report.desc}</div>
      <div style={s.addr}>{report.addr}</div>
      {report.entidad && (
        <div style={s.ai}>
          <span style={s.dot} />
          IA: {report.entidad}
        </div>
      )}
      <div style={s.bottom}>
        <button style={s.voteBtn} onClick={handleVote}
          onMouseEnter={(e) => { e.target.style.borderColor="var(--accent3)"; e.target.style.color="var(--accent3)"; }}
          onMouseLeave={(e) => { e.target.style.borderColor="var(--border)";  e.target.style.color="var(--muted)"; }}
        >
          + {report.votes}
        </button>
        {report.urgencia && (
          <span style={{ ...s.urgBadge, ...URGENCIA_STYLE[report.urgencia] }}>
            {report.urgencia.toUpperCase()}
          </span>
        )}
      </div>
    </div>
  );
}
