import { APIGatewayProxyHandler } from "aws-lambda";
import { document } from "../../utils/DynamoDB";
import { errorResponse } from "../../utils/errorResponse"

export const handler: APIGatewayProxyHandler = async (event) => {
  const { todo_id } = event.pathParameters

  const todo = await document.query({
    TableName: "todos",
    KeyConditionExpression: "id=:todo_id",
    ExpressionAttributeValues: {
      ":todo_id": todo_id
    }
  }).promise()

  if(!todo.Items[0]) {
    return errorResponse(400, "Invalid parameters")
  }

  await document.put({
    TableName: "todos",
    Item: {
      id: todo.Items[0].id,
      user_id: todo.Items[0].user_id,
      title: todo.Items[0].title,
      done: true,
      deadline: todo.Items[0].deadline
    }
  }).promise()

  return {
    statusCode: 200,
    body: JSON.stringify({
      message: "toDo checked"
    })
  }
}