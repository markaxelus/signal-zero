import { DynamoDBClient } from "@aws-sdk/client-dynamodb"
import { DynamoDBDocumentClient, QueryCommand } from "@aws-sdk/lib-dynamodb"

const client = new DynamoDBClient({ region: "us-east-1" });
const ddb = DynamoDBDocumentClient.from(client);

export const handler = async (event: any) => {
  try {
    const prefix = event.queryStringParameters?.prefix || "";

    const result = await ddb.send(
      new QueryCommand({
        TableName: "Locations",
        IndexName: "geohash-index",
        KeyConditionExpression: "#type = :type AND begins_with(geohash, :prefix)",
        ExpressionAttributeNames: { "#type": "type" },
        ExpressionAttributeValues: { 
          ":type": "REAL", 
          ":prefix": prefix 
        }
      })
    );

    return {
      statusCode: 200,
      headers: { 
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json"
      },
      body: JSON.stringify(result.Items)
    };
  } catch (error: any) {
    console.error("Data Fetch Error:", error);
    return {
      statusCode: 500,
      headers: { 
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ 
        message: "Internal Server Error", 
        error: error.message,
        name: error.name
      })
    };
  }
};

