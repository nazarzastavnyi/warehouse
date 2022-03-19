export const Warehouse = {
  TableName: 'Warehouse',
  KeySchema: [       
    { AttributeName: 'id', KeyType: 'HASH'},
    { AttributeName: 'name', KeyType: 'RANGE'},
  ],
  AttributeDefinitions: [       
    { AttributeName: 'id', AttributeType: 'N' },
    { AttributeName: 'name', AttributeType: 'S' },
  ],
  ProvisionedThroughput: {
      ReadCapacityUnits: 1,
      WriteCapacityUnits: 1
  }
};
  
