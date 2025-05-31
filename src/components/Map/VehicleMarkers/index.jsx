import L from 'leaflet';
import { useMemo } from 'react';
import ReactDOMServer from 'react-dom/server';
import TypeAvatar from '@/components/CustomSearchControl/TypeAvatar';
import { useFileData } from "@/contexts/FileDataContext/FileDataContext";
import { Marker } from 'react-leaflet';

const VehicleMarkers = ({ setSelectedVehicleId }) => {
  const { fileData } = useFileData();

  const markers = useMemo(() => {
    return fileData
      .filter(entry => entry?.vehicle && entry?.vehicle?.position && entry?.tripUpdate?.trip?.routeId)
      .map((entry) => {
        const { latitude, longitude } = entry.vehicle.position;
        const routeType = entry.vehicle.routeType;
        const routeId = entry.tripUpdate.trip.routeId;
        if (routeType === "0" || routeType === "3") {
          const htmlString = ReactDOMServer.renderToString(
            <TypeAvatar type={routeType} marker={true} label={routeId} />
          );
          const icon = L.divIcon({ html: htmlString, className: '' });

          return (
            <Marker
              key={`${entry.id}`}
              position={[latitude, longitude]}
              icon={icon}
              eventHandlers={{
                click: () => {setSelectedVehicleId(entry.id)}
              }}
            />
          );
        }

        return null;
      });
  }, [fileData, setSelectedVehicleId]);


  return markers;
}


export default VehicleMarkers