import { APIGatewayTokenAuthorizerEvent, Context, Callback } from "aws-lambda";
import * as jwt from "jsonwebtoken";

const SECRET_KEY = process.env.SECRET_KEY || "";

export const authorize = async (
  event: APIGatewayTokenAuthorizerEvent,
  context: Context,
  callback: Callback
) => {
  try {
    const token = event.authorizationToken || "";

    if (!token) {
      return callback("Unauthorized");
    }

    let decoded: string | jwt.JwtPayload | undefined;

    try {
      decoded = jwt.verify(token, SECRET_KEY);
    } catch (error) {
      console.error("Token verification error:", error);
      return callback("Unauthorized");
    }

    if (!decoded || typeof decoded === "string") {
      return callback("Unauthorized");
    }

    return callback(
      null,
      generatePolicy(decoded.sub as string, "Allow", event.methodArn || "")
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
