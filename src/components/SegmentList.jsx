import SegmentItem from './SegmentItem';

const SegmentList = ({ segments, onSegmentSelect }) => {
  if (segments.length === 0) {
    return <p>Nenhum segmento encontrado com os filtros atuais.</p>;
  }

  return (
    <ul className="segment-list">
      {segments.map(segment => (
        <SegmentItem 
          key={segment.id} 
          segment={segment} 
          onSelect={onSegmentSelect} 
        />
      ))}
    </ul>
  );
};

export default SegmentList;