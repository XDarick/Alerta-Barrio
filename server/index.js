const express = require("express");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

let reports = [
  { id:1, cat:"zona_roja",  desc:"Zona de alto riesgo, presencia constante de delincuentes en la noche.", addr:"Av. Larco, Miraflores", lat:-12.0531, lng:-77.0282, votes:18, entidad:"Serenazgo / PNP", urgencia:"alta", createdAt: new Date(Date.now()-3600000).toISOString() },
  { id:2, cat:"emergencia", desc:"Pelea entre personas con armas blancas frente al parque.", addr:"Jr. de la Unión, Cercado", lat:-12.0464, lng:-77.0428, votes:34, entidad:"PNP / Bomberos", urgencia:"alta", createdAt: new Date(Date.now()-7200000).toISOString() },
  { id:3, cat:"extorsion",  desc:"Cobro de cupos a comerciantes de la cuadra 5.", addr:"Av. Universitaria, San Miguel", lat:-12.1200, lng:-77.0300, votes:9, entidad:"PNP — División Antifraude", urgencia:"alta", createdAt: new Date(Date.now()-1800000).toISOString() },
  { id:4, cat:"robo",       desc:"Robo de celulares en moto a transeúntes.", addr:"Av. Brasil, Jesús María", lat:-12.0350, lng:-77.0550, votes:22, entidad:"Serenazgo / PNP", urgencia:"media", createdAt: new Date(Date.now()-900000).toISOString() },
  { id:5, cat:"zona_roja",  desc:"Venta de sustancias ilegales en la noche.", addr:"Av. La Marina, San Miguel", lat:-12.0700, lng:-77.0800, votes:41, entidad:"Serenazgo / PNP", urgencia:"alta", createdAt: new Date(Date.now()-5400000).toISOString() },
];
let nextId = 6;

app.get("/api/health", (req, res) => res.json({ status:"ok", total:reports.length }));
app.get("/api/reports", (req, res) => {
  const { cat } = req.query;
  res.json(cat ? reports.filter(r => r.cat === cat) : reports);
});
app.get("/api/reports/:id", (req, res) => {
  const r = reports.find(r => r.id === Number(req.params.id));
  if (!r) return res.status(404).json({ error:"Not found" });
  res.json(r);
});
app.post("/api/reports", (req, res) => {
  const { cat, desc, addr, lat, lng, entidad, urgencia } = req.body;
  if (!cat || !desc) return res.status(400).json({ error:"cat and desc required" });
  const r = { id:nextId++, cat, desc, addr:addr||"Lima, Perú", lat:lat||-12.0464, lng:lng||-77.0428, votes:0, entidad:entidad||"PNP", urgencia:urgencia||"alta", createdAt:new Date().toISOString() };
  reports.unshift(r);
  console.log(`Nuevo reporte [${cat}]: ${desc.substring(0,50)}`);
  res.status(201).json(r);
});
app.patch("/api/reports/:id/vote", (req, res) => {
  const r = reports.find(r => r.id === Number(req.params.id));
  if (!r) return res.status(404).json({ error:"Not found" });
  r.votes++;
  res.json({ votes:r.votes });
});
app.get("/api/stats", (req, res) => {
  const today = reports.filter(r => Date.now() - new Date(r.createdAt).getTime() < 86400000).length;
  const byCategory = reports.reduce((a,r) => { a[r.cat]=(a[r.cat]||0)+1; return a; }, {});
  res.json({ total:reports.length, today, byCategory });
});

app.listen(PORT, () => {
  console.log(`AlertaBarrio server on http://localhost:${PORT}`);
});
