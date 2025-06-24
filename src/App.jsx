import { useState, useEffect, useMemo } from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Map from "./components/Map";
import Controls from "./components/Controls";
import SegmentList from "./components/SegmentList";
import DetailsPanel from "./components/DetailsPanel";
import Modal from "./components/Modal";
import MyActivities from "./components/MyActivities";
import "./App.css";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";
const centerPoint = { lat: -5.833095347730074, lon: -35.181564754458854 };

function App() {
  const [isAppLoading, setIsAppLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [segments, setSegments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activity, setActivity] = useState("running");
  const [sortOrder, setSortOrder] = useState("default");
  const [selectedSegmentId, setSelectedSegmentId] = useState(null);
  const [filterText, setFilterText] = useState("");

  useEffect(() => {
    async function checkUserStatus() {
      console.log("--- DEBUG: 1. Verificando status do usuário...");
      try {
        const response = await fetch(`${API_URL}/api/user`, {
          credentials: "include",
        });
        console.log(
          "--- DEBUG: 2. Status da resposta de /api/user:",
          response.status
        );

        const data = await response.json();
        console.log("--- DEBUG: 3. Dados recebidos de /api/user:", data);

        if (data.user) {
          console.log(
            "--- DEBUG: 4. Usuário encontrado! Atualizando o estado.",
            data.user
          );
          setUser(data.user);
        } else {
          console.log(
            "--- DEBUG: 5. Nenhum usuário na sessão encontrado na resposta."
          );
        }
      } catch (error) {
        console.error(
          "--- DEBUG: Erro CRÍTICO ao verificar status do usuário:",
          error
        );
      } finally {
        setIsAppLoading(false);
      }
    }
    checkUserStatus();
  }, []);

  useEffect(() => {
    async function fetchSegments() {
      setLoading(true);
      setError(null);
      try {
        const areaSize = 0.05;
        const locationBounds = [
          centerPoint.lat - areaSize,
          centerPoint.lon - areaSize,
          centerPoint.lat + areaSize,
          centerPoint.lon + areaSize,
        ].join(",");
        const apiUrl = `${API_URL}/api/segments?bounds=${locationBounds}&activity_type=${activity}`;
        const response = await fetch(apiUrl, { credentials: "include" });
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Erro no servidor.");
        }
        const data = await response.json();
        setSegments(data.segments || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    if (!isAppLoading) {
      fetchSegments();
    }
  }, [activity, isAppLoading]);

  const processedSegments = useMemo(() => {
    let segmentsToProcess = [...segments];
    if (filterText)
      segmentsToProcess = segmentsToProcess.filter((segment) =>
        segment.name.toLowerCase().includes(filterText.toLowerCase())
      );
    if (sortOrder === "distance")
      return segmentsToProcess.sort((a, b) => a.distance - b.distance);
    if (sortOrder === "elevation")
      return segmentsToProcess.sort(
        (a, b) => b.elev_difference - a.elev_difference
      );
    return segmentsToProcess;
  }, [segments, sortOrder, filterText]);

  const handleCloseModal = () => {
    setSelectedSegmentId(null);
  };

  if (isAppLoading) {
    return (
      <div className="loading-fullscreen">Verificando Autenticação...</div>
    );
  }

  return (
    <div className="app-wrapper">
      <Header user={user} />
      <div className="page-content">
        <Map
          segments={processedSegments}
          center={centerPoint}
          selectedSegmentId={selectedSegmentId}
        />
        <Controls
          currentActivity={activity}
          onActivityChange={setActivity}
          currentSort={sortOrder}
          onSortChange={setSortOrder}
          filterText={filterText}
          onFilterChange={setFilterText}
        />
        {user && <MyActivities filterText={filterText} />}
        <div className="segments-section">
          <h3>Explorar Segmentos</h3>
          {loading && <p>Carregando segmentos...</p>}
          {error && (
            <p className="error-message">Falha ao carregar dados: {error}</p>
          )}
          {!loading && !error && (
            <SegmentList
              segments={processedSegments}
              onSegmentSelect={setSelectedSegmentId}
            />
          )}
        </div>
      </div>
      <Modal isOpen={!!selectedSegmentId} onClose={handleCloseModal}>
        <DetailsPanel segmentId={selectedSegmentId} />
      </Modal>
      <Footer />
    </div>
  );
}

export default App;
