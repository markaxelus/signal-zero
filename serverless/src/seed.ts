import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";
import geohash from 'ngeohash';

const client = new DynamoDBClient({ region: 'us-east-1' });
const ddb = DynamoDBDocumentClient.from(client);

async function seed() {  
  await ddb.send(new PutCommand({
    TableName: "Locations",
    Item: {
      locationId: "test_id",
      latitude: 50.4284,
      longitude: -126.3656,
      geohash: geohash.encode(50.4284, -126.3656),
      title: "Downtown Coffee",
      category: "Restaurant",
      type: "REAL"
    }
  }));

  for (let i = 0; i < 100; i++) {
    const lat = Math.random() * 180 - 90;
    const lng = Math.random() * 360 - 180;
    await ddb.send(new PutCommand({
      TableName: "Locations",
      Item: {
        locationId: `decoy_${i}`,
        latitude: lat,
        longitude: lng,
        geohash: geohash.encode(lat, lng),
        title: "Decoy Location",
        type: "NOISE"
      }
    }))
  }
  console.log("Done Seeding with Geohashes");
}

seed().catch(console.error);

