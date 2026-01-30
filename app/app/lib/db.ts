import Dexie, { type EntityTable } from 'dexie';

export interface WildfireLocation {
  id: number;
  locationId: string;
  latitude: number;
  longitude: number;
  type: 'REAL' | 'NOISE';
  confidence: string;
  syncStatus: 'synced' | 'pending';
}

const db = new Dexie('WildfireDB') as Dexie & {
  locations: EntityTable<
    WildfireLocation,
    'id' // PK id (for the type system)
  >;
};

db.version(1).stores({
  locations: '++id, locationId, syncStatus' // PK ++id (for the runtime)
});

export { db };