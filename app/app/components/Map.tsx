'use client'
import 'mapbox-gl/dist/mapbox-gl.css';
import { useMemo } from 'react';
import Map, { Source, Layer, type LayerProps } from 'react-map-gl/mapbox'
import type { FeatureCollection } from 'geojson';

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
  const geoJson = useMemo((): FeatureCollection => {
    const points = Array.from({ length: 10000 }).map((_, i) => ({
      type: 'Feature' as const,
      geometry: {
        type: 'Point' as const,
        coordinates: [
          -123.37 + (Math.random() - 0.5) * 5,
          48.4 + (Math.random() - 0.5) * 5
        ]
      },
      properties: { id: i }
    }));

    return {
      type: 'FeatureCollection' as const,
      features: points
    }
  }, []);

  const perimeterGeoJson = useMemo((): FeatureCollection => {
    const perimeters = Array.from({ length: 50 }).map((_, i) => {
      const lng = -123.37 + (Math.random() - 0.5) * 5;
      const lat = 48.4 + (Math.random() - 0.5) * 5;
      const r = 0.1;
      return {
        type: 'Feature' as const,
        geometry: {
          type: 'Polygon' as const,
          coordinates: [[
            [lng - r, lat - r],
            [lng + r, lat - r],
            [lng + r, lat + r],
            [lng - r, lat + r],
            [lng - r, lat - r]
          ]]
        },
        properties: { id: i }
      }
    });

    return {
      type: 'FeatureCollection' as const,
      features: perimeters
    }
  }, []);

  
  return (
    <div style={{ width: '100%', height: '100vh', position: 'relative' }}>
      <Map
        initialViewState={{
          longitude: -123.37,
          latitude: 48.4,
          zoom: 8
        }}
        mapStyle="https://demotiles.maplibre.org/style.json"
        mapboxAccessToken={MAPBOX_TOKEN}
      >
        <Source id='wildfire-perimeters' type='geojson' data={perimeterGeoJson}>
          <Layer {...perimeterLayer}/>
        </Source>     
        <Source id='wildfire-hotspots' type='geojson' data={geoJson}>
          <Layer {...hotspotLayer}/>
        </Source>     
      </Map>
    </div>
  );
}
