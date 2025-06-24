import { FiArrowRight, FiTrendingUp, FiBarChart2, FiExternalLink } from 'react-icons/fi';

const SegmentItem = ({ segment, onSelect }) => {
  const distanceInKm = (segment.distance / 1000).toFixed(2);
  const elevationInM = segment.elev_difference.toFixed(2);
  const averageGrade = segment.distance > 0
    ? ((segment.elev_difference / segment.distance) * 100).toFixed(1)
    : '0.0';

  return (
    // O card inteiro é clicável para selecionar o segmento
    <li className="segment-item card" onClick={() => onSelect(segment.id)}>
      <div className="segment-item-header">
        {/* O nome agora é apenas um texto, não um link navegável */}
        <span className="segment-name">{segment.name}</span>

        {/* O ícone é o novo link oficial para o site do Strava */}
        <a 
          href={`https://www.strava.com/segments/${segment.id}`}
          target="_blank"
          rel="noopener noreferrer"
          className="external-link-icon"
          onClick={(e) => e.stopPropagation()} // Impede que o clique no ícone também selecione o item
          title="Ver no Strava"
        >
          <FiExternalLink />
        </a>
      </div>

      <div className="segment-details">
        <span className="detail-item"><FiArrowRight /> {distanceInKm} km</span>
        <span className="detail-item"><FiTrendingUp /> {elevationInM} m</span>
        <span className="detail-item"><FiBarChart2 /> {averageGrade}%</span>
      </div>
    </li>
  );
};

export default SegmentItem;
