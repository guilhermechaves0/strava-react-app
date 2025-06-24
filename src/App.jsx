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

const centerPoint = { lat: -5.833095347730074, lon: -35.181564754458854 };

function App() {
  // Estados da nossa aplicação
  const [segments, setSegments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activity, setActivity] = useState("running");
  const [sortOrder, setSortOrder] = useState("default");
  const [selectedSegmentId, setSelectedSegmentId] = useState(null);
  const [filterText, setFilterText] = useState("");
  const [user, setUser] = useState(null);

  // EFEITO 1: Roda apenas UMA VEZ para verificar o status de login do usuário.
  useEffect(() => {
    async function checkUserStatus() {
      try {
        const response = await fetch("http://localhost:3000/api/user", {
          credentials: "include",
        });
        const data = await response.json();
        if (data.user) {
          setUser(data.user);
        }
      } catch (error) {
        console.error("Erro ao verificar status do usuário:", error);
      }
    }
    checkUserStatus();
  }, []); // Array de dependências vazio, para rodar só no início.

  // EFEITO 2: Roda sempre que a 'activity' mudar para buscar novos segmentos.
  useEffect(() => {
    async function fetchSegments() {
      setLoading(true);
      setError(null);
      setSelectedSegmentId(null);
      setFilterText("");
      try {
        const areaSize = 0.05;
        const locationBounds = [
          centerPoint.lat - areaSize,
          centerPoint.lon - areaSize,
          centerPoint.lat + areaSize,
          centerPoint.lon + areaSize,
        ].join(",");

        // --- LINHA CORRIGIDA USANDO CONCATENAÇÃO COM '+' ---
        const apiUrl =
          "http://localhost:3000/api/segments?bounds=" +
          locationBounds +
          "&activity_type=" +
          activity;

        const response = await fetch(apiUrl, { credentials: "include" }); // <-- ADICIONE ESTA OPÇÃO
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
    fetchSegments();
  }, [activity]); // Depende apenas da 'activity'.

  // Lógica para filtrar e ordenar os segmentos (continua a mesma)
  const processedSegments = useMemo(() => {
    let segmentsToProcess = [...segments];
    if (filterText) {
      segmentsToProcess = segmentsToProcess.filter((segment) =>
        segment.name.toLowerCase().includes(filterText.toLowerCase())
      );
    }
    if (sortOrder === "distance") {
      return segmentsToProcess.sort((a, b) => a.distance - b.distance);
    }
    if (sortOrder === "elevation") {
      return segmentsToProcess.sort(
        (a, b) => b.elev_difference - a.elev_difference
      );
    }
    return segmentsToProcess;
  }, [segments, sortOrder, filterText]);

  // Função para fechar o modal
  const handleCloseModal = () => {
    setSelectedSegmentId(null);
  };

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

        {/* SEÇÃO 1: SUAS ATIVIDADES (só aparece se estiver logado) */}
        {user && <MyActivities filterText={filterText} />}

        {/* SEÇÃO 2: EXPLORAR SEGMENTOS */}
        <div className="segments-section">
          <h3>Explorar Segmentos</h3>

          {loading && <p>Carregando segmentos...</p>}
          {error && (
            <p className="error-message">Falha ao carregar dados: {error}</p>
          )}

          {/* A lista de segmentos agora vive aqui dentro. O CSS cuidará das colunas. */}
          {!loading && !error && (
            <SegmentList
              segments={processedSegments}
              onSegmentSelect={setSelectedSegmentId}
            />
          )}
        </div>
      </div>

      {/* O Modal continua aqui, fora do fluxo principal, pronto para ser ativado */}
      <Modal isOpen={!!selectedSegmentId} onClose={handleCloseModal}>
        <DetailsPanel segmentId={selectedSegmentId} />
      </Modal>

      <Footer />
    </div>
  );
}

export default App;
