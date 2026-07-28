import { useEffect } from "react";
import { useMap } from "react-leaflet";

export default function MapFlyController({ selectedCoords }) {
  const map = useMap();

  useEffect(() => {
    if (selectedCoords) {
      map.flyTo(selectedCoords, 16, { duration: 1.5 });
    }
  }, [selectedCoords, map]);

  return null;
}