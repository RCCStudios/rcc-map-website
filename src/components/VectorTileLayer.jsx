import { useEffect } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";
import "@maplibre/maplibre-gl-leaflet";
import "maplibre-gl/dist/maplibre-gl.css";

function VectorTileLayer({ styleUrl }) {
  const map = useMap();

  useEffect(() => {
    const glLayer = L.maplibreGL({
      style: styleUrl,
    });

    glLayer.addTo(map);

    return () => {
      map.removeLayer(glLayer);
    };
  }, [map, styleUrl]);

  return null;
}

export default VectorTileLayer;