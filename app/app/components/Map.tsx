'use client'
import Map, { Marker } from 'react-map-gl/maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';

export default function MapComponent() {
  return (
    <Map
      initialViewState={{
        longitude: -122.4,
        latitude: 37.8,
        zoom: 5
      }}
      style={{ width: '100%', height: '1279px' }}
      mapStyle="https://demotiles.maplibre.org/style.json"
    >
      <Marker longitude={-122.4} latitude={37.8} color="red" />
    </Map>
  );
}

