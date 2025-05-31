import { useMap } from "react-leaflet";
import { useFileData } from "@/contexts/FileDataContext/FileDataContext";
import { useEffect } from "react";

const FlyToVehicle = ({ selectedVehicleId }) => {
  const { fileData } = useFileData();
  const map = useMap();

  useEffect(() => {
    if (selectedVehicleId) {
      const entry = fileData.find((e) => e.id === selectedVehicleId);
      if (entry && entry.vehicle && entry.vehicle.position) {
        const { latitude, longitude } = entry.vehicle.position;
        map.flyTo([latitude, longitude], 18, {
          duration: 1.5,
        });
      }
    }
  }, [selectedVehicleId, map, fileData]);

  return null;
};

export default FlyToVehicle;
