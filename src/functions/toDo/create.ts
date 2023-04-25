import { v4 as uuidV4 } from 'uuid'
import { APIGatewayProxyHandler } from 'aws-lambda'
import { errorResponse } from 'src/utils/errorResponse'
import { document } from "../../utils/DynamoDB";

interface IRequestToDo {
  title: string,
  deadline: Date
}

export const handler: APIGatewayProxyHandler = async (event) => {
  if(!event.body || !JSON.parse(event.body).title || !JSON.parse(event.body).deadline) {
    return errorResponse(400, "Title and deadline is missing!")
  }

  const { user_id } = event.pathParameters
  const { title, deadline } = JSON.parse(event.body) as IRequestToDo

  await document.put({
    TableName: "todos",
    Item: {
      id: uuidV4(),
      user_id,
      title,
      done: false,
      deadline
    }
  }).promise()

  return { 
    statusCode: 201,
    body: JSON.stringify({
      message: "Todo Created"
    })
  }
}