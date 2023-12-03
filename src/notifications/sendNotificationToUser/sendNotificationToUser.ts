import { SQSEvent } from "aws-lambda";
import * as AWS from "aws-sdk";
const dynamoDB = new AWS.DynamoDB.DocumentClient();
const ses = new AWS.SES();
const TABLE_NAME = process.env.TABLE_NAME || "users";

exports.handler = async (event: SQSEvent) => {
  try {
    console.log(event);
    for (const record of event.Records) {
      const messageBody = JSON.parse(record.body);
      const userEmail = messageBody.userEmail;
      console.log(userEmail);

      if (userEmail) {
        await sendNotification(userEmail, messageBody.message);
      }
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Notifications sent successfully" }),
    };
  } catch (error) {
    console.error("Error sending notifications:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Internal server error" }),
    };
  }
};

async function sendNotification(userEmail: string, message: string) {
  const params = {
    Destination: {
      ToAddresses: [userEmail],
    },
    Message: {
      Body: {
        Text: {
          Data: message,
        },
      },
      Subject: {
        Data: "Notification",
      },
    },
    Source: "yurijfedorr@gmail.com",
  };

  await ses.sendEmail(params).promise();
}
