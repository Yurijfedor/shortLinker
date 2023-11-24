import { DynamoDB } from "aws-sdk";
const bcrypt = require("bcrypt");

const dynamoDb = new DynamoDB.DocumentClient();
const USERS_TABLE = process.env.USERS_TABLE || "DefaultUsersTable"; // Назва таблиці DynamoDB

interface RegisterRequest {
  email: string;
  password: string;
}

export const handler = async (event: { body: string }) => {
  try {
    const { email, password } = JSON.parse(event.body) as RegisterRequest;

    if (!email || !password) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "Email and password are required." }),
      };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const params = {
      TableName: USERS_TABLE,
      Item: {
        email,
        password: hashedPassword,
      },
      ConditionExpression: "attribute_not_exists(email)",
    };

    await dynamoDb.put(params).promise();

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "User registered successfully." }),
    };
  } catch (error) {
    if (typeof error === "object" && error !== null && "code" in error) {
      const dynamoError = error as { code: string; message: string };

      if (dynamoError.code === "ConditionalCheckFailedException") {
        return {
          statusCode: 409,
          body: JSON.stringify({ message: "User already exists." }),
        };
      }
    }
    console.error(error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Internal Server Error" }),
    };
  }
};
