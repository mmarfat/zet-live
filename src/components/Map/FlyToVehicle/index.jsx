import { useMap } from "react-leaflet";
import { useFileData } from "@/contexts/FileDataContext/FileDataContext";
import { useEffect } from "react";
import { FIELD_MAP } from "@/utils/fieldMap";

const FlyToVehicle = ({ selectedVehicleId }) => {
  const { fileData } = useFileData();
  const map = useMap();

  useEffect(() => {
    if (selectedVehicleId) {
      const entry = fileData.find((e) => e?.[FIELD_MAP.id] === selectedVehicleId);
      const latitude = entry?.[FIELD_MAP.latitude];
      const longitude = entry?.[FIELD_MAP.longitude];
      map.flyTo([latitude, longitude], 18, {
        duration: 1.5,
      });
    }
  }, [selectedVehicleId, map, fileData]);

  return null;
};

export default FlyToVehicle;
