import React, { useState, useEffect, useCallback } from "react";
import Header from "./components/Header.jsx";
import MapView from "./components/MapView.jsx";
import Sidebar from "./components/Sidebar.jsx";
import { getReports, getStats } from "./utils/api.js";

export default function App() {
  const [reports, setReports] = useState([]);
  const [stats, setStats] = useState({ total: 0, today: 0 });
  const [selectedId, setSelectedId] = useState(null);
  const [activeTab, setActiveTab] = useState("feed");
  const [clickedLatLng, setClickedLatLng] = useState(null);

  // Load reports from backend
  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    const [r, s] = await Promise.all([getReports(), getStats()]);
    setReports(r);
    setStats(s);
  }

  function handleMapClick(lat, lng) {
    setClickedLatLng({ lat, lng });
    setActiveTab("reportar");
  }

  function handleCardClick(report) {
    setSelectedId(report.id);
  }

  function handleReportAdded(newReport) {
    setReports((prev) => [newReport, ...prev]);
    setStats((prev) => ({ ...prev, total: prev.total + 1, today: prev.today + 1 }));
    setSelectedId(newReport.id);
    setActiveTab("feed");
  }

  function handleNewReport() {
    setActiveTab("reportar");
    setClickedLatLng(null);
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      <Header stats={stats} onNewReport={handleNewReport} />
      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
        <MapView
          reports={reports}
          selectedId={selectedId}
          onMapClick={handleMapClick}
        />
        <Sidebar
          reports={reports}
          selectedId={selectedId}
          onCardClick={handleCardClick}
          onReportAdded={handleReportAdded}
          clickedLatLng={clickedLatLng}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />
      </div>
    </div>
  );
}
