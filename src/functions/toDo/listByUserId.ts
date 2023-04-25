import { APIGatewayProxyHandler } from "aws-lambda";
import { document } from "../../utils/DynamoDB";

export const handler: APIGatewayProxyHandler = async (event) => {
  const { user_id } = event.pathParameters;

  const allUserToDo = await document.scan({
    TableName: "todos",
    FilterExpression: "user_id = :user_id",
    ExpressionAttributeValues: {
      ":user_id": user_id
    }
  }).promise()

  return {
    statusCode: 200,
    body: JSON.stringify(allUserToDo.Items)
  }
}