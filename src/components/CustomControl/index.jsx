import { useEffect, useState } from 'react';
import { useMap } from 'react-leaflet';
import { createPortal } from 'react-dom';
import L from 'leaflet';

const CustomControl = ({ position, children }) => {
  const map = useMap();
  const [container] = useState(() => L.DomUtil.create('div'));

  useEffect(() => {
    const control = L.control({ position });
    control.onAdd = () => {
      L.DomEvent.disableClickPropagation(container);
      return container;
    };
    control.addTo(map);
    return () => {
      control.remove();
    };
  }, [map, container, position]);

  return createPortal(children, container);
};

export default CustomControl;
