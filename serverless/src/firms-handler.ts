import { DynamoDBClient, PutRequest$ } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, BatchWriteCommand } from "@aws-sdk/lib-dynamodb";
import geohash from 'ngeohash';

const client = new DynamoDBClient({ region: "us-east-1" });
const ddb = DynamoDBDocumentClient.from(client);

const FIRMS_URL = `https://firms.modaps.eosdis.nasa.gov/api/area/csv/${process.env.FIRMS_KEY}/VIIRS_SNPP_NRT/world/1`;

export const ingestFirms = async() => {
  console.log("Fetching NASA Firms data");
  const response = await fetch(FIRMS_URL);

  if (!response.ok) {
    throw new Error(`NASA API erorr: ${response.statusText} (${response.status})`)
  }
  
  const csvData = await response.text();
  const lines = csvData.trim().split('\n').slice(1);
  console.log(`Processign ${lines.length} hotspots`);

  const requests = lines.map((line, i) => {
    const col = line.split(',');
    const latitude = parseFloat(col[0]);
    const longitude = parseFloat(col[1]);
    const date = col[5];
    const time = col[6];
    const conf = col[10];

    return {
      PutRequest: {
        Item : {
          locationId: `firms_${date}_${time}${i}`,
          latitude,
          longitude,
          geohash: geohash.encode(latitude, longitude),
          type: 'REAL',
          confidence: conf,
          source: "NASA_FIRMS",
          createdAt: new Date().toISOString()
        }
      }
    }
  });

  // DynamoDB Batch Write limit 25 items
  for (let i = 0; i < requests.length; i+=25) {
    const chunk = requests.slice(i,i+25);
    await ddb.send(new BatchWriteCommand({
      RequestItems: {
        "Locations": chunk
      }
    }))
  }

  return {
    statusCode: 200,
    body: JSON.stringify({ message: "Success", count: requests.length })
  }

}