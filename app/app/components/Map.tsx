'use client'
import 'mapbox-gl/dist/mapbox-gl.css';
import { useMemo } from 'react';
import Map, { Source, Layer, type LayerProps } from 'react-map-gl/mapbox'
import type { FeatureCollection } from 'geojson';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../lib/db';
import { fetchLocationsByGeohash } from '../lib/sync';
import geohash from 'ngeohash';


const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN

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

const perimeterLayer: LayerProps = {
  id: 'perimeters',
  type: 'fill',
  paint: {
    'fill-color': '#ff4d4d',
    'fill-opacity': 0.2,
    'fill-outline-color': '#ff0000'
  }
};

export default function MapComponent() {
  const locations = useLiveQuery(() => db.locations.toArray());
  const handleMapMove = (e: any) => {
    const { longitude, latitude, zoom } = e.viewState;
    
    // Calculate prefix length based on zoom (higher zoom = longer prefix)
    const precision = zoom > 10 ? 5 : 3; 
    const prefix = geohash.encode(latitude, longitude).substring(0, precision);
    
    fetchLocationsByGeohash(prefix);
  };
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
  return (
    <div style={{ width: '100%', height: '100vh' }}>
      <Map
        initialViewState={{ longitude: -123.37, latitude: 48.4, zoom: 3 }}
        onMoveEnd={handleMapMove} // Trigger sync when panning stops
        mapStyle="https://demotiles.maplibre.org/style.json"
        mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
      >
        <Source id='wildfire-hotspots' type='geojson' data={geoJson}>
          <Layer {...hotspotLayer}/>
        </Source>     
      </Map>
    </div>
  );
}