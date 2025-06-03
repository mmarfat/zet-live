import L from 'leaflet';
import { useMemo } from 'react';
import ReactDOMServer from 'react-dom/server';
import TypeAvatar from '@/components/CustomSearchControl/TypeAvatar';
import { useFileData } from "@/contexts/FileDataContext/FileDataContext";
import { Marker } from 'react-leaflet';
import { FIELD_MAP } from '@/utils/fieldMap';

const VehicleMarkers = ({ setSelectedVehicleId }) => {
  const { fileData } = useFileData();

  const markers = useMemo(() => {
    return fileData
      .map((entry) => {
        const latitude = entry?.[FIELD_MAP.latitude];
        const longitude = entry?.[FIELD_MAP.longitude];
        const routeType = entry?.[FIELD_MAP.routeType];
        const routeId = entry?.[FIELD_MAP.routeId];
        if (routeType === "0" || routeType === "3") {
          const htmlString = ReactDOMServer.renderToString(
            <TypeAvatar type={routeType} marker={true} label={routeId} />
          );
          const icon = L.divIcon({ html: htmlString, className: '' });

          return (
            <Marker
              key={`${entry?.[FIELD_MAP.id]}`}
              position={[latitude, longitude]}
              icon={icon}
              eventHandlers={{
                click: () => {setSelectedVehicleId(entry?.[FIELD_MAP.id])}
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