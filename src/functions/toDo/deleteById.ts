import { APIGatewayProxyHandler } from "aws-lambda";
import { document } from "../../utils/DynamoDB";
import { errorResponse } from "src/utils/errorResponse";

export const handler: APIGatewayProxyHandler = async (event) => {
  const { todo_id } = event.pathParameters

  const toDo = await document.query({
    TableName: "todos",
    KeyConditionExpression: "id=:todo_id",
    ExpressionAttributeValues: {
      ":todo_id": todo_id
    }
  }).promise()

  if(!toDo.Items[0]) {
    return errorResponse(400, "Nothing was found")
  }

  await document.delete({
    TableName: "todos",
    Key: {
      id: todo_id
    }
  }).promise()

  return {
    statusCode: 200,
    body: JSON.stringify({
      message: "deleted successfully"
    })
  }
}