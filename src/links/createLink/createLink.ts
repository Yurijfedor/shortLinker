import { APIGatewayEvent } from "aws-lambda";
import * as AWS from "aws-sdk";
const { v4: uuidv4 } = require("uuid");

const dynamoDB = new AWS.DynamoDB.DocumentClient();
const TABLE_NAME = "links";

export const handler = async (event: APIGatewayEvent) => {
  try {
    if (!event.requestContext.authorizer) {
      return {
        statusCode: 401,
        body: JSON.stringify({ message: "Unauthorized" }),
      };
    }
    // Отримати дані користувача з авторизованого контексту
    const userId = event.requestContext.authorizer.principalId;

    if (event.body === null) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "No request body provided" }),
      };
    }

    const requestBody = JSON.parse(event.body);
    const { originalUrl, linkLifetime } = requestBody;

    const linkId = generateUniqueId(originalUrl);

    const params = {
      TableName: TABLE_NAME,
      Item: {
        userId,
        linkId,
        originalUrl,
        linkLifetime,
        isActive: true,
        createdAt: new Date().toISOString(),
      },
    };

    await dynamoDB.put(params).promise();

    return {
      statusCode: 201,
      body: JSON.stringify({ message: "Link created successfully", linkId }),
    };
  } catch (error) {
    console.error("Error creating link:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Internal server error" }),
    };
  }
};

function generateUniqueId(url: string) {
  const parsedUrl = new URL(url);
  const baseUrl = `${parsedUrl.hostname}/`;
  const uuid = uuidv4().slice(0, 6);
  return `${baseUrl}${uuid}`;
}
