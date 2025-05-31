import { useMap } from 'react-leaflet';
import CustomControl from '../CustomControl';
import { Button } from '@/components/ui/button';
import LanguageToggle from '@/components/LanguageToggle';
import ThemeToggle from '@/components/ThemeToggle';

const CustomZoomControl = () => {
  const map = useMap();

  const zoomIn = () => {
    map.zoomIn();
  };

  const zoomOut = () => {
    map.zoomOut();
  };

  return (
    <CustomControl position="bottomleft">
      <div className="flex flex-col gap-2 touch-manipulation">
        <ThemeToggle />
        <LanguageToggle />
        <div className="flex flex-col rounded-md shadow-xl/20">
          <Button 
            size="icon" 
            onClick={zoomIn}
            className="rounded-b-none text-lg w-full"
          >
            +
          </Button>
          <hr className="bg-background" />
          <Button 
            size="icon" 
            onClick={zoomOut}
            className="rounded-t-none text-lg w-full"
          >
            -
          </Button>
        </div>
      </div>
    </CustomControl>
  );
};

export default CustomZoomControl;