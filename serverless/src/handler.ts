import { DynamoDBClient } from "@aws-sdk/client-dynamodb"
import { DynamoDBDocumentClient, QueryCommand } from "@aws-sdk/lib-dynamodb"

const client = new DynamoDBClient({ region: "us-east-1" });
const ddb = DynamoDBDocumentClient.from(client);

export const handler = async(event: any) => {
  const result = await ddb.send(
    new QueryCommand({
      TableName: "Locations",
      IndexName: "geohash-index",
      KeyConditionExpression: "#type = :type AND begins_with(geohash, :prefix)",
      ExpressionAttributeNames: { "#type": "type" },
      ExpressionAttributeValues: { 
        ":type": "REAL", 
        ":prefix": "prefix" 
      }
    })
  )

  console.log("Query result:", JSON.stringify(result.Items, null, 2));

  return {
    statusCode: 200,
    headers: { "Access-Control-Allow-Origin": "*" },
    body: JSON.stringify(result.Items)
  }
}

handler({}).catch(console.error);
