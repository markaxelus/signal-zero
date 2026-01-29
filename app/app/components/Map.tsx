'use client'
import { useMemo } from 'react';
import Map, { Marker } from 'react-map-gl/maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';
import FPSCounter from './FPSCounter';

export default function MapComponent() {

  const points = useMemo(() => {
    return Array.from({ length: 10000 }).map((_, i) => ({
      id: i,
      longitude: -123.37 + (Math.random() - 0.5) * 5,
      latitude: 48.4 + (Math.random() - 0.5) * 5,
    }));
  }, []);

  return (
    <div style={{ width: '100%', height: '100vh', position: 'relative' }}>
      <FPSCounter />
      <Map
        initialViewState={{
          longitude: -123.37,
          latitude: 48.4,
          zoom: 8
        }}
        mapStyle="https://demotiles.maplibre.org/style.json"
      >
        {points.map(point => (
          <Marker 
            key={point.id} 
            longitude={point.longitude} 
            latitude={point.latitude} 
            color="red" 
          />
        ))}
      </Map>
    </div>
  );
}

