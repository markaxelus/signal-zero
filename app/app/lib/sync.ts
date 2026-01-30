import { db } from "./db";

export async function syncOfflineData() {
  const pending = await db.locations
    .where('syncStatus')
    .equals('pending')
    .toArray();
  
  
  if (pending.length == 0) return;

  console.log(`Syncing ${pending.length} items to DynamoDB`);

  for (const item of pending) {
    try {
      await fetch ('/SETUP API LAMBDA SERVERLESS PROB', {
        method: 'POST',
        body: JSON.stringify(item)
      });

      await db.locations.update(item.id!, {
        syncStatus: 'synced'
      });
    } catch (err) {
      console.error(`Sync failed for ${item}`, item.locationId);
    }
  }
}


window.addEventListener('online', syncOfflineData);