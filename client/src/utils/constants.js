export const LIMA = [-12.0464, -77.0428];

export const CAT_COLORS = {
  emergencia: "#ff0000",
  zona_roja:  "#cc2200",
  extorsion:  "#ff6600",
  robo:       "#ffaa00",
};

export const CAT_NAMES = {
  emergencia: "Emergencia",
  zona_roja:  "Zona Roja",
  extorsion:  "Extorsión",
  robo:       "Robo",
};

export function timeAgo(ts) {
  const d = Math.round((Date.now() - new Date(ts).getTime()) / 60000);
  if (d < 1) return "ahora mismo";
  if (d < 60) return `hace ${d}m`;
  const h = Math.round(d / 60);
  if (h < 24) return `hace ${h}h`;
  return `hace ${Math.round(h / 24)}d`;
}
