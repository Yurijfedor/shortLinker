import { APIGatewayEvent } from "aws-lambda";
import * as AWS from "aws-sdk";

const dynamoDB = new AWS.DynamoDB.DocumentClient();
const TABLE_NAME = process.env.TABLE_NAME || "links";

export const handler = async (event: APIGatewayEvent) => {
  try {
    const linkId = event.pathParameters?.linkId;
    if (!linkId) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "Link ID is missing" }),
      };
    }

    const link = await getLinkById(linkId);

    if (!link || !link.isActive) {
      return {
        statusCode: 404,
        body: JSON.stringify({ message: "Link not found or deactivated" }),
      };
    }

    if (
      link.expirationDate &&
      new Date(link.expirationDate * 1000) < new Date()
    ) {
      return {
        statusCode: 410,
        body: JSON.stringify({ message: "Link has expired" }),
      };
    }

    if (link.isOneTime) {
      await deactivateLink(linkId);
    }

    await recordVisit(linkId);

    return {
      statusCode: 302,
      headers: {
        Location: link.url,
      },
    };
  } catch (error) {
    console.error("Error handling short link:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Internal server error" }),
    };
  }
};

async function getLinkById(linkId: string) {
  const params = {
    TableName: TABLE_NAME,
    Key: { linkId },
  };
  const result = await dynamoDB.get(params).promise();
  return result.Item;
}

async function recordVisit(linkId: string) {
  const params = {
    TableName: TABLE_NAME,
    Key: { linkId },
    UpdateExpression:
      "SET visitCount = if_not_exists(visitCount, :initial) + :increment",
    ExpressionAttributeValues: {
      ":increment": 1,
      ":initial": 0,
    },
  };
  await dynamoDB.update(params).promise();
}

async function deactivateLink(linkId: string) {
  const params = {
    TableName: TABLE_NAME,
    Key: { linkId },
    UpdateExpression: "SET isActive = :isActive",
    ExpressionAttributeValues: {
      ":isActive": false,
    },
  };
  await dynamoDB.update(params).promise();
}
