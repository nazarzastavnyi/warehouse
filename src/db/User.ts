export const User = {
  TableName: 'User',
  KeySchema: [       
    { AttributeName: 'login', KeyType: 'HASH'},
  ],
  AttributeDefinitions: [       
    { 
      AttributeName: 'login', 
      AttributeType: 'S' 
    },
    {
      AttributeName: 'token',
      AttributeType: 'S',
    },
  ],
  ProvisionedThroughput: {
    ReadCapacityUnits: 1,
    WriteCapacityUnits: 1
  },
  GlobalSecondaryIndexes: [
    { 
      IndexName: 'token_index', 
      KeySchema: [
        {
          AttributeName: 'token',
          KeyType: 'HASH',
        }
      ],
      Projection: {
        ProjectionType: 'ALL'
      },
      ProvisionedThroughput: { 
        ReadCapacityUnits: 1,
        WriteCapacityUnits: 1,
      },
    }
  ]
};
