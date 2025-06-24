import { useState, useEffect } from "react";
import {
  FiAward,
  FiUsers,
  FiRepeat,
  FiCalendar,
  FiShield,
  FiUserCheck,
} from "react-icons/fi";

const formatTime = (timeInSeconds) => {
  if (!timeInSeconds) return "N/A";

  const minutes = Math.floor(timeInSeconds / 60);
  const seconds = timeInSeconds % 60;

  // O retorno é APENAS o texto formatado.
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
};

const DetailsPanel = ({ segmentId }) => {
  const [details, setDetails] = useState(null);
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!segmentId) {
      setDetails(null);
      setLeaderboard([]);
      return;
    }

    const fetchAllDetails = async () => {
      setLoading(true);
      setError(null);
      try {
        // Fazemos as duas chamadas em paralelo
        const [detailsResponse, leaderboardResponse] = await Promise.all([
          fetch(`http://localhost:3000/api/segments/${segmentId}`),
          fetch(`http://localhost:3000/api/segments/${segmentId}/leaderboard`, {
            credentials: "include",
          }), // Inclui o cookie de sessão!
        ]);

        if (!detailsResponse.ok) throw new Error("Falha ao buscar detalhes.");
        const detailsData = await detailsResponse.json();
        setDetails(detailsData);

        // O leaderboard só é carregado se o usuário estiver logado
        if (leaderboardResponse.ok) {
          const leaderboardData = await leaderboardResponse.json();
          setLeaderboard(leaderboardData.entries || []);
        } else {
          setLeaderboard([]); // Limpa se der erro (ex: não logado)
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAllDetails();
  }, [segmentId]);

  if (!segmentId) {
    return (
      <div className="details-panel-placeholder card">
        Clique em um segmento para ver os detalhes.
      </div>
    );
  }

  if (loading) {
    return <div className="details-panel card">Buscando detalhes...</div>;
  }

  if (error) {
    return (
      <div className="details-panel card error-message">Erro: {error}</div>
    );
  }

  return (
    <div className="details-panel card">
      {details && (
        <>
          <h3>{details.name}</h3>
          {/* NOVO: Exibe o recorde pessoal se existir! */}
          {details.athlete_segment_stats && (
            <p>
              <FiUserCheck /> <strong>Seu Recorde (PR):</strong>{" "}
              {formatTime(details.athlete_segment_stats.pr_elapsed_time)}
            </p>
          )}
          <p>
            <FiAward color="#FFD700" /> <strong>KOM:</strong>{" "}
            {details.xoms?.kom || "N/A"}
          </p>
          <p>
            <FiAward color="#FF69B4" /> <strong>QOM:</strong>{" "}
            {details.xoms?.qom || "N/A"}
          </p>
          <p>
            <FiRepeat /> <strong>Tentativas:</strong>{" "}
            {details.effort_count?.toLocaleString("pt-BR")}
          </p>
          <p>
            <FiUsers /> <strong>Atletas:</strong>{" "}
            {details.athlete_count?.toLocaleString("pt-BR")}
          </p>
          <p>
            <FiCalendar /> <strong>Criado em:</strong>{" "}
            {new Date(details.created_at).toLocaleDateString("pt-BR")}
          </p>

          {/* Seção do Leaderboard que agora vai funcionar */}
          {leaderboard.length > 0 && (
            <>
              <hr className="divider" />
              <h4>
                <FiShield /> Top 10 Leaderboard
              </h4>
              <table className="leaderboard-table">
                {/* ... a estrutura da tabela continua a mesma ... */}
              </table>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default DetailsPanel;
