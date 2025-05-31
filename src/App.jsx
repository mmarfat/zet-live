import { useState } from "react";
import Map from "./components/Map";
import CustomSearchControl from "./components/CustomSearchControl";
import FileDataProvider from "./contexts/FileDataContext/FileDataProvider";

function App() {

  const [selectedVehicleId, setSelectedVehicleId] = useState(null);

  return (
    <FileDataProvider>
      <div className="relative w-full h-dvh">
        <Map selectedVehicleId={selectedVehicleId} setSelectedVehicleId={setSelectedVehicleId} />
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-999">
          <CustomSearchControl onSelect={setSelectedVehicleId} />
        </div>
      </div>
    </FileDataProvider>
  );
}

export default App;
