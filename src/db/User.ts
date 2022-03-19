export const User = {
  TableName: 'User',
  KeySchema: [       
    { AttributeName: 'login', KeyType: 'HASH'},
    { AttributeName: 'password', KeyType: 'RANGE'},
  ],
  AttributeDefinitions: [       
    { AttributeName: 'login', AttributeType: 'S' },
    { AttributeName: 'password', AttributeType: 'S' },
  ],
  ProvisionedThroughput: {
      ReadCapacityUnits: 1,
      WriteCapacityUnits: 1
  }
};
