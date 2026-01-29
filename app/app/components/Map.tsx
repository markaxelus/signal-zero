'use client'
import { useMemo } from 'react';
import Map, { Marker } from 'react-map-gl/maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';

export default function MapComponent() {

  return (
    <div style={{ width: '100%', height: '100vh', position: 'relative' }}>
      <Map
        initialViewState={{
          longitude: -123.37,
          latitude: 48.4,
          zoom: 8
        }}
        mapStyle="https://demotiles.maplibre.org/style.json"
      >
          <Marker
            longitude={ -123.37} 
            latitude={48.4} 
            color="red" 
          />
      </Map>
    </div>
  );
}

