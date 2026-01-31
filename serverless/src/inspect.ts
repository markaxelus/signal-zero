import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, ScanCommand } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({ region: "us-east-1" });
const ddb = DynamoDBDocumentClient.from(client);

async function inspectTable() {
  const response = await ddb.send(new ScanCommand({
    TableName: "Locations",
    Limit: 5
  }));

  console.log("Table Inspection:");
  console.log(`Total Items Scanned: ${response.ScannedCount}`);
  console.log("First 5 items:", JSON.stringify(response.Items, null, 2));

  // Also check some random items with 'REAL' type if possible
  const realItems = await ddb.send(new ScanCommand({
    TableName: "Locations",
    FilterExpression: "#t = :t",
    ExpressionAttributeNames: { "#t": "type" },
    ExpressionAttributeValues: { ":t": "REAL" },
    Limit: 5
  }));
  console.log("First 5 REAL items:", JSON.stringify(realItems.Items, null, 2));
}

inspectTable().catch(console.error);
