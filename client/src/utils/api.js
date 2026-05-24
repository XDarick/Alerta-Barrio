const BASE = "/api";

export async function getReports() {
  const res = await fetch(`${BASE}/reports`);
  return res.json();
}

export async function createReport(data) {
  const res = await fetch(`${BASE}/reports`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function voteReport(id) {
  const res = await fetch(`${BASE}/reports/${id}/vote`, { method: "PATCH" });
  return res.json();
}

export async function getStats() {
  const res = await fetch(`${BASE}/stats`);
  return res.json();
}

export async function searchPlace(query) {
  const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query + ", Lima, Peru")}&limit=5`;
  const res = await fetch(url, { headers: { "Accept-Language": "es" } });
  return res.json();
}

export async function classifyWithAI(cat, desc) {
  try {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 300,
        system: `Eres un asistente de seguridad urbana para Lima, Perú. Responde SOLO con JSON sin markdown:
{"entidad":"entidad pública responsable (PNP, Serenazgo, etc)","urgencia":"alta|media|baja","sugerencia":"acción recomendada en máx 25 palabras"}`,
        messages: [{ role: "user", content: `Tipo de incidente: ${cat}. Descripción: ${desc}` }],
      }),
    });
    const data = await res.json();
    const text = data.content[0].text.replace(/```json|```/g, "").trim();
    return JSON.parse(text);
  } catch {
    const fallback = {
      emergencia: "PNP / Bomberos",
      zona_roja:  "Serenazgo / PNP",
      extorsion:  "PNP — División Antifraude",
      robo:       "Serenazgo / PNP",
    };
    return { entidad: fallback[cat] || "PNP", urgencia: "alta", sugerencia: "Contactar a la autoridad competente de inmediato." };
  }
}
