import { document } from "../../utils/DynamoDB";
import { APIGatewayProxyHandler } from "aws-lambda";

export const handler: APIGatewayProxyHandler = async (event) => {
  const response = await document.scan({
    TableName: "todos"
  }).promise()

  return {
    statusCode: 200,
    body: JSON.stringify(response.Items)
  }
}