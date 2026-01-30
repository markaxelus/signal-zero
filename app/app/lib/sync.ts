import { db, type WildfireLocation } from "./db";

const API_URL = 'https://f2gv5gg3jf.execute-api.us-east-1.amazonaws.com';

/**
 * PULL: Fetches NASA hotspots from DynamoDB for a specific spatial area (geohash)
 * and saves them to the local Dexie database.
 */
export async function fetchLocationsByGeohash(prefix:string) {
  try {
    const response =  await fetch(`${API_URL}/query?prefix=${prefix}`);
    const locations = await response.json();

    if(Array.isArray(locations)){
      await db.locations.bulkPut(locations.map((loc: Omit<WildfireLocation, 'id' | 'syncStatus'>) => ({
        ...loc,
        syncStatus: 'synced' as const
      })))
      console.log(`Pull completed: Synced ${locations.length} NASA items for area ${prefix}`);
    } else {
      console.error("Server response was not an array:", locations);
    }
  } catch (err) {
    console.error("Failed to fetch spatial data from server", err);
  }
}

/**
 * PUSH: Finds locally created reports that are offline/pending
 * and sends them to the server when online.
 */
export async function syncOfflineData() {
  const pending = await db.locations
    .where('syncStatus')
    .equals('pending')
    .toArray();
  
  
  if (pending.length == 0) return;

  console.log(`Syncing ${pending.length} items to DynamoDB`);

  for (const item of pending) {
    try {
      await fetch (`${API_URL}/sync`, {
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(item)
      });

      await db.locations.update(item.id!, {
        syncStatus: 'synced'
      });
    } catch (_err) {
      console.error(`Sync failed for ${item}`, item.locationId);
    }
  }
}

if (typeof window !== 'undefined') {
  window.addEventListener('online', syncOfflineData);
}