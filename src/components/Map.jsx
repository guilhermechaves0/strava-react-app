import { useEffect, useRef } from 'react';
import L from 'leaflet';
import { decode } from '@mapbox/polyline';
import 'leaflet/dist/leaflet.css';

const Map = ({ segments, center, selectedSegmentId }) => {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const layerGroupRef = useRef(null);
  const layersRef = useRef({}); // Guarda as camadas por ID

  useEffect(() => {
    if (mapContainerRef.current && !mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current).setView([center.lat, center.lon], 13);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(map);
      mapInstanceRef.current = map;
      layerGroupRef.current = L.layerGroup().addTo(map);
    }
  }, [center]);

  useEffect(() => {
    const layerGroup = layerGroupRef.current;
    if (!layerGroup) return;

    layerGroup.clearLayers();
    layersRef.current = {}; // Limpa as referências

    if (segments && segments.length > 0) {
      segments.forEach(segment => {
        if (segment.points) {
          const latlngs = decode(segment.points).map(p => [p[0], p[1]]);
          const route = L.polyline(latlngs, {
              color: '#FC5200', weight: 3, opacity: 0.8
          }).bindPopup(`<b>${segment.name}</b>`).addTo(layerGroup);
          layersRef.current[segment.id] = route; // Salva a camada com seu ID
        }
      });
    }
  }, [segments]);

  // NOVO EFEITO: Reage quando um segmento é selecionado
  useEffect(() => {
    if (selectedSegmentId && layersRef.current[selectedSegmentId]) {
      const layer = layersRef.current[selectedSegmentId];
      mapInstanceRef.current.fitBounds(layer.getBounds(), { padding: [50, 50] });
      layer.openPopup();
    }
  }, [selectedSegmentId]);

  return <div ref={mapContainerRef} id="map" />;
};

export default Map;