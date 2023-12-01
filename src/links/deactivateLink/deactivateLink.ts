import { APIGatewayEvent } from "aws-lambda";
import * as AWS from "aws-sdk";

const dynamoDB = new AWS.DynamoDB.DocumentClient();
const TABLE_NAME = process.env.TABLE_NAME || "links";

export const handler = async (event: APIGatewayEvent) => {
  try {
    const authorizer = event.requestContext.authorizer;

    if (!authorizer) {
      return {
        statusCode: 401,
        body: JSON.stringify({ message: "Unauthorized" }),
      };
    }

    const userId = authorizer.principalId;
    const linkId = event.pathParameters?.linkId;
    console.log(userId, linkId);
    if (!linkId) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "Link ID is missing" }),
      };
    }

    const link = await getLinkById(linkId);

    if (!link) {
      return {
        statusCode: 404,
        body: JSON.stringify({ message: "Link not found" }),
      };
    }

    await deactivateLinkInDB(linkId);

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Link deactivated successfully" }),
    };
  } catch (error) {
    console.error("Error deactivating link:", error);
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

async function deactivateLinkInDB(linkId: string) {
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
