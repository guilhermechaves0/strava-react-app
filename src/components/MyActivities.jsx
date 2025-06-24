import { useState, useEffect, useMemo } from "react"; // Importamos o useMemo
import { FiClock, FiArrowRight } from "react-icons/fi";

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const formatDistance = (distance) => (distance / 1000).toFixed(2);

// 1. O componente agora aceita a prop "filterText"
const MyActivities = ({ filterText }) => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const response = await fetch(
          `${API_URL}/api/athlete/activities`,
          {
            credentials: "include",
          }
        );
        if (!response.ok) throw new Error("Falha ao buscar atividades.");
        const data = await response.json();
        setActivities(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchActivities();
  }, []);

  // 2. Criamos uma lista processada, assim como fizemos no App.jsx
  const filteredActivities = useMemo(() => {
    if (!filterText) {
      return activities; // Se não houver texto no filtro, retorna todas as atividades
    }
    return activities.filter((activity) =>
      activity.name.toLowerCase().includes(filterText.toLowerCase())
    );
  }, [activities, filterText]); // Essa lógica roda sempre que as atividades ou o texto do filtro mudam

  if (loading) {
    return (
      <div className="card my-activities-container">
        <p>Carregando suas atividades...</p>
      </div>
    );
  }

  return (
    <div className="my-activities-container">
      <h2>Suas Atividades Recentes</h2>
      <ul className="segment-list">
        {/* 3. Mapeamos a lista JÁ FILTRADA */}
        {filteredActivities.length > 0 ? (
          filteredActivities.map((activity) => (
            <li key={activity.id} className="segment-item card">
              <span className="segment-name">{activity.name}</span>
              <div className="segment-details">
                <span className="detail-item">
                  <strong>{activity.type}</strong>
                </span>
                <span className="detail-item">
                  <FiArrowRight /> {formatDistance(activity.distance)} km
                </span>
                <span className="detail-item">
                  <FiClock />{" "}
                  {new Date(activity.start_date_local).toLocaleDateString(
                    "pt-BR"
                  )}
                </span>
              </div>
            </li>
          ))
        ) : (
          <p>Nenhuma atividade encontrada com este nome.</p>
        )}
      </ul>
    </div>
  );
};

export default MyActivities;
