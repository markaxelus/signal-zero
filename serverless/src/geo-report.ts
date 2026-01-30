import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, QueryCommand } from "@aws-sdk/lib-dynamodb";
import geohash from 'ngeohash';

const client = new DynamoDBClient({ region: "us-east-1" });
const ddb = DynamoDBDocumentClient.from(client);


async function geoHashReport() {
  const userLat = 50.4284;
  const userLng = -126.3656;

  const userGeoHash = geohash.encode(userLat, userLng);
  // We look for items in the same ~20km area (first 4 characters)
  const prefix = userGeoHash.substring(0,4);

  const startTime = Date.now();

  const response = await ddb.send( new QueryCommand({
    TableName: "Locations",
    IndexName: "geohash-index",
    // We use Query instead of Scan. This is O(1) instead of O(N).
    KeyConditionExpression: "#type = :type AND begins_with(geohash, :prefix)",
    ExpressionAttributeNames: {
      "#type": "type"
    },
    ExpressionAttributeValues: {
      ":type": "REAL",
      ":prefix": prefix
    }
  }));

  const endTime = Date.now();

  const scanned = response.ScannedCount || 0;
  const found = response.Count || 0;
  const efficiency = scanned > 0 ? (found/scanned) * 100 : 0;

  console.log("\n==========================================");
  console.log("            GEOHASH-QUERY REPORT       ");
  console.log("==========================================");
  console.log(`Response Time:    ${endTime - startTime}ms`);
  console.log(`Items Scanned:    ${scanned}`);
  console.log(`Items Found:      ${found}`);
  console.log(`Efficiency Ratio: ${efficiency.toFixed(2)}%`);
}

geoHashReport().catch(console.error);