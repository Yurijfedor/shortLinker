import * as AWS from "aws-sdk";

const dynamoDB = new AWS.DynamoDB.DocumentClient();
const TABLE_NAME = process.env.TABLE_NAME || "links";

exports.handler = async (event: AWSLambda.APIGatewayEvent) => {
  // Отримати ідентифікатор користувача з авторизації
  const authorizer = event.requestContext.authorizer;

  if (!authorizer) {
    return {
      statusCode: 401,
      body: JSON.stringify({ message: "Unauthorized" }),
    };
  }

  const userId = authorizer.principalId;

  try {
    // Отримати список посилань, створених користувачем
    const params = {
      TableName: TABLE_NAME,
      FilterExpression: "userId = :userId",
      ExpressionAttributeValues: {
        ":userId": userId,
      },
    };
    const result = await dynamoDB.scan(params).promise();

    // Перевірити, чи `result.Items` не є `undefined`, а потім використовувати його
    if (result.Items) {
      // Форматувати відповідь з списком посилань та кількістю відвідувань
      const links = result.Items.map((item) => ({
        linkId: item.linkId,
        originalUrl: item.url,
        visits: item.visitCount,
      }));

      return {
        statusCode: 200,
        body: JSON.stringify(links),
      };
    } else {
      return {
        statusCode: 500,
        body: JSON.stringify({ message: "No links found" }),
      };
    }
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Internal server error" }),
    };
  }
};
