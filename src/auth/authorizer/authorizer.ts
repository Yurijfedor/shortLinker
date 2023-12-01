import { APIGatewayTokenAuthorizerEvent, Context, Callback } from "aws-lambda";
import jwt from "jsonwebtoken";
const AWS = require("aws-sdk");
const {
  SecretsManagerClient,
  GetSecretValueCommand,
} = require("@aws-sdk/client-secrets-manager");

const secret_name = "MySecret";
const client = new SecretsManagerClient({
  region: "eu-central-1",
});

export const authorize = async (
  event: APIGatewayTokenAuthorizerEvent,
  context: Context,
  callback: Callback
) => {
  let response;
  try {
    response = await client.send(
      new GetSecretValueCommand({
        SecretId: secret_name,
        VersionStage: "AWSCURRENT",
      })
    );
    const SECRET_KEY = response.SecretString;

    const token = event.authorizationToken || "";

    if (!token) {
      return callback("Unauthorized");
    }

    // Перевірка типу токену (Bearer)
    const tokenParts = token.split(" ");
    if (tokenParts.length !== 2 || tokenParts[0] !== "Bearer") {
      return callback("Unauthorized");
    }

    // Видалення "Bearer " з токену
    const authToken = tokenParts[1];

    let decoded: string | jwt.JwtPayload | undefined;

    try {
      decoded = jwt.verify(authToken, SECRET_KEY);
    } catch (error) {
      console.error("Token verification error:", error);
      return callback("Unauthorized");
    }

    if (!decoded || typeof decoded === "string") {
      return callback("Unauthorized");
    }
    console.log(decoded);
    return callback(
      null,
      generatePolicy(decoded.userId as string, "Allow", event.methodArn || "")
    );
  } catch (error) {
    console.error("Authorization error:", error);
    return callback("Unauthorized");
  }
};

function generatePolicy(principalId: string, effect: string, resource: string) {
  const authResponse: any = {
    principalId,
  };

  if (effect && resource) {
    const policyDocument = {
      Version: "2012-10-17",
      Statement: [
        {
          Action: "execute-api:Invoke",
          Effect: effect,
          Resource: resource,
        },
      ],
    };
    authResponse.policyDocument = policyDocument;
  }

  return authResponse;
}
