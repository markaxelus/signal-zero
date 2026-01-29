import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({ region: 'us-east-1' });
const ddb = DynamoDBDocumentClient.from(client);

async function seed() {
  for (let i = 0; i < 100; i++) {
    await ddb.send(new PutCommand({
      TableName: "Locations",
      Item: {
        locationId: `decoy_${i}`,
        latitude: Math.random() * 180 - 90, 
        longitude: Math.random() * 360 - 180, 
        title: "Decoy Location",
        type: "NOISE"
      }
    }))
  }
  console.log("Done Seeding");
}

seed().catch(console.error);

