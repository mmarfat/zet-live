import { useState } from 'react';

import { 
  TileLayer,
  MapContainer,
  useMapEvents,
  AttributionControl
} from 'react-leaflet';

import 'leaflet/dist/leaflet.css';
import { useTheme } from 'next-themes';
import CustomZoomControl from '../CustomZoomControl';
import VehicleMarkers from './VehicleMarkers';
import { useFileData } from '@/contexts/FileDataContext/FileDataContext';
import FlyToVehicle from './FlyToVehicle';

const Map = ({ selectedVehicleId, setSelectedVehicleId }) => {
  
  const { resolvedTheme } = useTheme();

  const [center, setCenter] = useState([45.8, 15.985]);
  const [zoom, setZoom] = useState(13);

  const { fileData } = useFileData();

  const MapEventTracker = () => {
    useMapEvents({
      moveend: (e) => setCenter(e.target.getCenter()),
      zoomend: (e) => setZoom(e.target.getZoom()),
      drag: () => setSelectedVehicleId(null)
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
      attributionControl={false}
      whenCreated={(map) => {
        setCenter(map.getCenter());
        setZoom(map.getZoom());
      }}
    >
      <TileLayer
        attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        className={resolvedTheme === "dark" ? "map-tiles-dark" : null}
      />
      <MapEventTracker />
      <CustomZoomControl />
      {fileData && <VehicleMarkers selectedVehicleId={selectedVehicleId} setSelectedVehicleId={setSelectedVehicleId} />}
      {fileData && <FlyToVehicle selectedVehicleId={selectedVehicleId} />}
      <AttributionControl position="bottomright" prefix={'&copy; <a href="https://www.zet.hr/gtfs-rt-protobuf">ZET GTFS-RT</a>'} />
    </MapContainer>
  );
};

export default Map;