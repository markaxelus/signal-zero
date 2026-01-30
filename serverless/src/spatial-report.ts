import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, ScanCommand } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({ region: "us-east-1" });
const ddb = DynamoDBDocumentClient.from(client);

async function runSpatialReport() {
  // Center: Victoria, BC
  const userLat = 50.4284;
  const userLng = -126.3656;
  const offset = 0.5; // Approx 50km

  const startTime = Date.now();

  const response = await ddb.send(new ScanCommand({
    TableName: "Locations",
    FilterExpression: "latitude BETWEEN :minLat AND :maxLat AND longitude BETWEEN :minLng AND :maxLng",
    ExpressionAttributeValues: {
      ":minLat": userLat - offset,
      ":maxLat": userLat + offset,
      ":minLng": userLng - offset,
      ":maxLng": userLng + offset,
    }
  }));

  const endTime = Date.now();
  
  const scanned = response.ScannedCount || 0;
  const found = response.Count || 0;
  const efficiency = scanned > 0 ? (found / scanned) * 100 : 0;

  console.log("\n==========================================");
  console.log("        SPATIAL BLINDNESS REPORT       ");
  console.log("==========================================");
  console.log(`Response Time:    ${endTime - startTime}ms`);
  console.log(`Items Scanned:    ${scanned}`);
  console.log(`Items Found:      ${found}`);
  console.log(`Efficiency Ratio: ${efficiency.toFixed(2)}%`);

}

runSpatialReport().catch(console.error);
