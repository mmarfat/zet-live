import { useState } from 'react';

import { 
  TileLayer,
  MapContainer,
  useMapEvents
} from 'react-leaflet';

import 'leaflet/dist/leaflet.css'
import { useTheme } from 'next-themes';
import CustomZoomControl from '../CustomZoomControl';
import CustomSearchControl from '../CustomSearchControl';

const Map = () => {
  
  const { resolvedTheme } = useTheme();

  const [center, setCenter] = useState([45.8, 15.985]);
  const [zoom, setZoom] = useState(13);

  const MapEventTracker = () => {
    useMapEvents({
      moveend: (e) => {
        setCenter(e.target.getCenter());
      },
      zoomend: (e) => {
        setZoom(e.target.getZoom());
      },
    });
    return null;
  };

  return (
    <MapContainer
      key={`${resolvedTheme}-map-container`}
      center={center}
      zoom={zoom}
      scrollWheelZoom={true}
      zoomControl={false}
      className="h-dvh bg-background!"
      whenCreated={(map) => {
        setCenter(map.getCenter());
        setZoom(map.getZoom());
      }}
    >
      <TileLayer
        key={`${resolvedTheme}-tile-layer`}
        attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        className={resolvedTheme === "dark" ? "map-tiles-dark" : null}
      />
      <MapEventTracker />
      <CustomSearchControl />
      <CustomZoomControl />
    </MapContainer>
  );
};

export default Map;