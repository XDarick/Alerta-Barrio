# 🗺️ AlertaBarrio

**Civic urban reporting platform for Lima, Perú.**  
Citizens report urban problems — potholes, broken lights, waste, unsafe zones — on an interactive map. AI automatically classifies each report and routes it to the responsible authority.

**Built by [Andres Darick Velasquez](https://github.com/XDarick)**

![React](https://img.shields.io/badge/React-18-61DAFB?logo=react)
![Node.js](https://img.shields.io/badge/Node.js-18+-339933?logo=node.js)
![Claude AI](https://img.shields.io/badge/Claude-AI-orange)
![License](https://img.shields.io/badge/License-MIT-green)

---

## ✨ Features

- 🗺️ **Interactive dark map** of Lima with real-time report markers
- 📍 **Click-to-report** — click anywhere on the map to set location
- 🤖 **AI classification** — Claude AI analyzes each report, determines the responsible entity and urgency level
- 📋 **Live feed** — real-time list of all reports with voting system
- 🎨 **Color-coded categories** — potholes, lighting, waste, insecurity
- 📡 **REST API** — full Node.js backend with in-memory storage
- 📊 **Live stats** — total reports, today's count, active zones

---

## 🛠️ Tech Stack

| Layer       | Technology                  |
|-------------|-----------------------------|
| Frontend    | React 18, Vite              |
| Map         | Leaflet.js, CartoDB tiles   |
| Backend     | Node.js, Express            |
| AI          | Anthropic Claude API        |
| Styling     | CSS-in-JS, Barlow Condensed |

---

## 🚀 Getting Started

```bash
# 1. Clone
git clone https://github.com/XDarick/Alerta-Barrio.git
cd alertabarrio

# 2. Install all dependencies
npm run install:all

# 3. Run (starts both frontend & backend)
npm run dev
```

- **Frontend** → http://localhost:5173
- **Backend API** → http://localhost:3001/api

---

## 📡 API Endpoints

| Method | Endpoint                   | Description          |
|--------|----------------------------|----------------------|
| GET    | `/api/reports`             | Get all reports      |
| POST   | `/api/reports`             | Create a new report  |
| PATCH  | `/api/reports/:id/vote`    | Upvote a report      |
| GET    | `/api/stats`               | Get platform stats   |
| GET    | `/api/health`              | Health check         |

### Create report payload
```json
{
  "cat": "bache",
  "desc": "Large pothole on main avenue, dangerous for motorcycles.",
  "lat": -12.0531,
  "lng": -77.0282,
  "addr": "Av. Larco, Miraflores",
  "entidad": "Municipalidad Distrital",
  "urgencia": "alta"
}
```

---

## 📁 Project Structure

```
alertabarrio/
├── server/
│   └── index.js              # Express server & REST API
├── client/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Header.jsx    # Top bar with live stats
│   │   │   ├── MapView.jsx   # Leaflet interactive map
│   │   │   ├── Sidebar.jsx   # Feed + form container
│   │   │   ├── ReportCard.jsx
│   │   │   └── ReportForm.jsx # Form with AI classification
│   │   ├── utils/
│   │   │   ├── api.js        # API calls + Claude AI
│   │   │   └── constants.js  # Shared config
│   │   └── App.jsx
│   └── vite.config.js
└── package.json
```

---

## 🤖 How AI Classification Works

When a citizen submits a report, the description is sent to the Claude API which returns:
- **Responsible entity** (e.g. "Municipalidad Distrital", "Serenazgo / PNP")
- **Urgency level** (alta / media / baja)
- **Action suggestion** for the citizen

If the API is unavailable, a local fallback handles classification by category.

---

## 📄 License

MIT — free to use and modify.

---

> Built with ❤️ in Lima, Perú by **Darick Velasquez**  
> Part of a full-stack developer portfolio — React + Node.js
