import { APIGatewayEvent } from "aws-lambda";
import * as AWS from "aws-sdk";

const dynamoDB = new AWS.DynamoDB.DocumentClient();
const sqs = new AWS.SQS();

const TABLE_NAME = process.env.TABLE_NAME || "links";
const QUEUE_URL = process.env.QUEUE_URL || "";

exports.handler = async (event: APIGatewayEvent) => {
  try {
    const params = {
      TableName: TABLE_NAME,
      FilterExpression: "isActive = :active AND expirationDate <= :currentDate",
      ExpressionAttributeValues: {
        ":active": true,
        ":currentDate": Math.floor(Date.now() / 1000),
      },
    };
    const result = await dynamoDB.scan(params).promise();

    if (!result.Items) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          message: "No notifications found",
        }),
      };
    }

    for (const link of result.Items) {
      await sendNotificationToQueue(link.userEmail, link.linkId);
      await deactivateLink(link.linkId);
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "Notifications sent and links deactivated",
      }),
    };
  } catch (error) {
    console.error("Error handling notifications:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Internal server error" }),
    };
  }
};

async function sendNotificationToQueue(userEmail: string, linkId: string) {
  const message = {
    userEmail,
    message: `Your link ${linkId} has expired.`,
  };

  const params = {
    QueueUrl: QUEUE_URL,
    MessageBody: JSON.stringify(message),
  };

  await sqs.sendMessage(params).promise();
}

async function deactivateLink(linkId: string) {
  const params = {
    TableName: TABLE_NAME,
    Key: { linkId },
    UpdateExpression: "SET isActive = :inactive",
    ExpressionAttributeValues: { ":inactive": false },
  };
  await dynamoDB.update(params).promise();
}
