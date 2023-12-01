const AWS = require("aws-sdk");
const bcrypt = require("bcryptjs");
import jwt from "jsonwebtoken";
const {
  SecretsManagerClient,
  GetSecretValueCommand,
} = require("@aws-sdk/client-secrets-manager");

const dynamoDB = new AWS.DynamoDB.DocumentClient();

const secret_name = "MySecret";
const client = new SecretsManagerClient({
  region: "eu-central-1",
});

exports.handler = async (event: AWSLambda.APIGatewayEvent) => {
  if (event.body === null) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: "No request body provided" }),
    };
  }
  let response;
  try {
    response = await client.send(
      new GetSecretValueCommand({
        SecretId: secret_name,
        VersionStage: "AWSCURRENT",
      })
    );
    const SECRET_KEY = response.SecretString;

    const { email, password } = JSON.parse(event.body);

    const params = {
      TableName: "users",
      Key: { email },
    };

    const user = await dynamoDB.get(params).promise();

    if (!user.Item || !bcrypt.compareSync(password, user.Item.password)) {
      return {
        statusCode: 401,
        body: JSON.stringify({ message: "Authentication failed" }),
      };
    }

    const userId = user.Item.id;

    const token = jwt.sign({ email, userId }, SECRET_KEY);

    return {
      statusCode: 200,
      body: JSON.stringify({ token }),
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Internal server error" }),
    };
  }
};
