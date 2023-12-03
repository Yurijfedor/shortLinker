import { APIGatewayEvent } from "aws-lambda";
import * as AWS from "aws-sdk";
const { v4: uuidv4 } = require("uuid");

const dynamoDB = new AWS.DynamoDB.DocumentClient();
const TABLE_NAME = process.env.TABLE_NAME || "links";

export const handler = async (event: APIGatewayEvent) => {
  try {
    if (!event.requestContext.authorizer) {
      return {
        statusCode: 401,
        body: JSON.stringify({ message: "Unauthorized" }),
      };
    }

    const userId = event.requestContext.authorizer.principalId;
    const userEmail = event.requestContext.authorizer.email;

    if (event.body === null) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "No request body provided" }),
      };
    }

    const requestBody = JSON.parse(event.body);
    const { url, lifetime } = requestBody;

    const linkId = generateUniqueId();

    const expirationDate = calculateExpirationDate(lifetime);

    const isOneTime = lifetime === "one-time" ? true : false;

    const params = {
      TableName: TABLE_NAME,
      Item: {
        userId,
        userEmail,
        linkId,
        url,
        expirationDate,
        isOneTime,
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

function generateUniqueId() {
  const uuid = uuidv4().slice(0, 6);
  return uuid;
}

function calculateExpirationDate(lifetime: string): number {
  switch (lifetime) {
    case "one-time":
      return Math.floor(Date.now() / 1000) + 3153600000;
    case "1 day":
      return Math.floor(Date.now() / 1000) + 24 * 60 * 60;
    case "3 days":
      return Math.floor(Date.now() / 1000) + 3 * 24 * 60 * 60;
    case "7 days":
      return Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60;
    default:
      return Math.floor(Date.now() / 1000) + 24 * 60 * 60;
  }
}
