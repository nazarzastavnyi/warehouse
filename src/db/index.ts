import DynamoDb from 'aws-sdk/clients/dynamodb';
import {User} from './User';
import {Warehouse} from './Warehouse';

const dynamodb = new DynamoDb({
  region: process.env.AWS_REGION,
  accessKeyId: process.env.AWS_ACCESS_ID,
  secretAccessKey: process.env.AWS_SECRET_KEY,
});

const createTableIfNotExist = (params: DynamoDb.CreateTableInput): void => {
  dynamodb.listTables({}).promise().then(async (data) => {
    const exists = data.TableNames
      .filter(name => {
        return name === params.TableName;
      }).length > 0;
    if (!exists) {
      dynamodb.createTable(params).promise();
    }
  });
};

createTableIfNotExist(User);
createTableIfNotExist(Warehouse);

const createDynamoDBClient = (): DynamoDb.DocumentClient => {
  return new DynamoDb.DocumentClient({
    service: dynamodb
  });
};

export default createDynamoDBClient;
