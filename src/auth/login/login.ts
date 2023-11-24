const AWS = require("aws-sdk");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const dynamoDB = new AWS.DynamoDB.DocumentClient();
const SECRET_KEY = process.env.SECRET_KEY;

exports.handler = async (event: AWSLambda.APIGatewayEvent) => {
  if (event.body === null) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: "No request body provided" }),
    };
  }

  try {
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

    const token = jwt.sign({ email }, SECRET_KEY);

    return {
      statusCode: 200,
      body: JSON.stringify({ token }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Internal server error" }),
    };
  }
};
