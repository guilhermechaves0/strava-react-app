const Controls = ({ 
  currentActivity, onActivityChange, 
  currentSort, onSortChange,
  filterText, onFilterChange // Novas props para o filtro
}) => {
  return (
    <div className="controls-container card">
      <div className="control-group">
        <span>Atividade:</span>
        <button onClick={() => onActivityChange('running')} className={currentActivity === 'running' ? 'active' : ''}>Corrida</button>
        <button onClick={() => onActivityChange('riding')} className={currentActivity === 'riding' ? 'active' : ''}>Ciclismo</button>
      </div>
      <div className="control-group">
        <span>Ordenar por:</span>
        <button onClick={() => onSortChange('default')} className={currentSort === 'default' ? 'active' : ''}>Padrão</button>
        <button onClick={() => onSortChange('distance')} className={currentSort === 'distance' ? 'active' : ''}>Distância</button>
        <button onClick={() => onSortChange('elevation')} className={currentSort === 'elevation' ? 'active' : ''}>Elevação</button>
      </div>
      {/* O NOVO CAMPO DE FILTRO */}
      <div className="control-group">
        <input 
          type="text" 
          className="filter-input"
          placeholder="Filtrar por nome..." 
          value={filterText}
          onChange={(e) => onFilterChange(e.target.value)}
        />
      </div>
    </div>
  );
};

export default Controls;