import * as AWS from 'aws-sdk';
import DynamoDb from 'aws-sdk/clients/dynamodb';

const createDynamoDBClient = (): DynamoDb.DocumentClient => {
  const dynamodb = new DynamoDb({
    region: process.env.AWS_REGION,
    accessKeyId: process.env.AWS_ACCESS_ID,
    secretAccessKey: process.env.AWS_SECRET_KEY,
  });
  return new AWS.DynamoDB.DocumentClient({
    service: dynamodb
  });
};

export default createDynamoDBClient;