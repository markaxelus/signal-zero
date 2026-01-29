import { DynamoDBClient } from "@aws-sdk/client-dynamodb"
import { DynamoDBDocumentClient, QueryCommand } from "@aws-sdk/lib-dynamodb"

const client = new DynamoDBClient({ region: "us-east-1" });
const ddb = DynamoDBDocumentClient.from(client);

export const handler = async(event: any) => {
  const result = await ddb.send(
    new QueryCommand({
      TableName: "Locations",
      KeyConditionExpression: "pk = :pk",
      ExpressionAttributeValues: {
        ":pk": event.pk || "default-pk"
      }
    })
  )

  return {
    statusCode: 200,
    body: JSON.stringify(result.Items)
  }
}
