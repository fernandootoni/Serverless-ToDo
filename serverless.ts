import type { AWS } from '@serverless/typescript';

const serverlessConfiguration: AWS = {
  service: 'serverless-todo',
  frameworkVersion: '3',
  plugins: ['serverless-esbuild', 'serverless-dynamodb-local', 'serverless-offline'],
  provider: {
    name: 'aws',
    runtime: 'nodejs14.x',
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      NODE_OPTIONS: '--enable-source-maps --stack-trace-limit=1000',
    },
  },
  // import the function via paths
  functions: { 
    createTodo: {
      handler: "src/functions/toDo/create.handler",
      events: [{
        http: {
          path: "todos/{user_id}",
          method: "post",
          cors: true
        }
      }]
    },
    listTodosByUser: {
      handler: "src/functions/toDo/listByUserId.handler",
      events: [{
        http: {
          path: "todos/{user_id}",
          method: "get",
          cors: true
        }
      }]
    },
    checkTodo: {
      handler: "src/functions/toDo/check.handler",
      events: [{
        http: {
          path: "todos/{todo_id}/done",
          method: "patch",
          cors: true
        }
      }]
    },
    listAllTodos: {
      handler: "src/functions/toDo/listAll.handler",
      events: [{
        http: {
          path: "todos",
          method: "get",
          cors: true
        }
      }]
    },
    deleteTodoById: {
      handler: "src/functions/toDo/deleteById.handler",
      events: [{
        http: {
          path: "todos/{todo_id}",
          method: "delete",
          cors: true
        }
      }]
    }
   },
  package: { individually: true },
  custom: {
    esbuild: {
      bundle: true,
      minify: false,
      sourcemap: true,
      exclude: ['aws-sdk'],
      target: 'node14',
      define: { 'require.resolve': undefined },
      platform: 'node',
      concurrency: 10,
    },
    dynamodb: {
      stages: ["dev", "local"],
      start: {
        port: 8000,
        inMemory: true,
        migrate: true
      }
    }
  },
  resources: {
    Resources: {
      dbTodos: {
        Type: "AWS::DynamoDB::Table",
        Properties: {
          TableName: "todos",
          ProvisionedThroughput: {
            ReadCapacityUnits: 5,
            WriteCapacityUnits: 5
          },
          AttributeDefinitions: [
            {
              AttributeName: "id",
              AttributeType: "S"
            }
          ],
          KeySchema: [
            {
              AttributeName: "id",
              KeyType: "HASH"
            }
          ]
        }
      }
    }
  }
};

module.exports = serverlessConfiguration;
