'use client'
import 'mapbox-gl/dist/mapbox-gl.css';
import { useMemo } from 'react';
import Map, { Source, Layer, type LayerProps } from 'react-map-gl/mapbox'
import { useEffect } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../lib/db';
import { fetchLocationsByGeohash } from '../lib/sync';
import geohash from 'ngeohash';


const hotspotLayer: LayerProps = {
  id: 'hotspot',
  type: 'circle',
  paint: {
    'circle-radius': 5,
    'circle-color': '#ff4d4d',
    'circle-stroke-width': 1,
    'circle-stroke-color': '#ffffff',
    'circle-opacity': 0.8
  }
};


export default function MapComponent() {
  const locations = useLiveQuery(() => db.locations.toArray());
  
  const geoJson = useMemo(() => {
    return {
      type: 'FeatureCollection' as const,
      features: (locations || []).map(loc => ({
        type: 'Feature' as const,
        geometry: { type: 'Point' as const, coordinates: [loc.longitude, loc.latitude] },
        properties: { id: loc.locationId, confidence: loc.confidence }
      }))
    };
  }, [locations]);


  useEffect(() => {
    // 'c' covers most of North America. 
    fetchLocationsByGeohash('c'); 
  }, []);
  const handleMapMove = (e: { viewState: { longitude: number; latitude: number; zoom: number } }) => {
    const { longitude, latitude, zoom } = e.viewState;
    // Zoom 3 (World) -> Prefix 'c' (Huge area)
    // Zoom 12 (Street) -> Prefix 'c2z4v' (Tiny area)
    const precision = zoom > 10 ? 5 : 3; 
    const prefix = geohash.encode(latitude, longitude).substring(0, precision);
    fetchLocationsByGeohash(prefix);
  };

  return (
    <div style={{ width: '100%', height: '100vh', position: 'relative' }}>
      <Map
        initialViewState={{ longitude: -123.37, latitude: 48.4, zoom: 3 }}
        onMoveEnd={handleMapMove} // Trigger sync when panning stops
        mapStyle="mapbox://styles/mapbox/dark-v11"
        mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
      >
        <Source id='wildfire-hotspots' type='geojson' data={geoJson}>
          <Layer {...hotspotLayer}/>
        </Source>     
      </Map>

      {/* Hotspot Counter */}
      <div style={{ 
        position: 'absolute', 
        top: 20, 
        left: 20, 
        background: 'rgba(15, 15, 15, 0.8)', 
        backdropFilter: 'blur(8px)',
        color: 'white', 
        padding: '12px 20px', 
        borderRadius: '12px', 
        zIndex: 10,
        fontFamily: 'Inter, system-ui, sans-serif',
        fontSize: '14px',
        fontWeight: '500',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
        display: 'flex',
        alignItems: 'center',
        gap: '8px'
      }}>
        <span style={{ color: '#ff4d4d' }}>●</span>
        <span>Local Hotspots: <b>{locations?.length || 0} / 22,000 discovered</b></span>
      </div>
    </div>
  );
}