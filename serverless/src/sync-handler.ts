import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";
import geohash from 'ngeohash';

const client = new DynamoDBClient({ region: "us-east-1" });
const ddb = DynamoDBDocumentClient.from(client);

export const syncHandler = async (event: any) => {
  const body = JSON.parse(event.body);
  const { latitude, longitude, locationId } = body;

  // Calculate the geohash on the server just to make sure its consistent
  const hash = geohash.encode(latitude, longitude);
  await ddb.send(new PutCommand({
    TableName: 'Locations',
    Item: {
      locationId: locationId,
      geohash: hash,
      latitude,
      longitude,
      createdAt: new Date().toISOString()
    }
  }));

  return {
    statusCode: 201,
    body: JSON.stringify({
      message: 'synced'
    })
  }
}