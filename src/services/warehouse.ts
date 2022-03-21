import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import { Warehouse } from '../interfaces/Warehouse';
import { v4 } from 'uuid';

export class WarehouseService {
  private db : DocumentClient;
  private tableName = 'Warehouse';

  constructor(db: DocumentClient) {
    this.db = db;
  }

  async getAllWarehouses(): Promise<Warehouse[]> {
    const result = await this.db
      .scan({
        TableName: this.tableName,
      })
      .promise();
    
    return result.Items as Warehouse[];
  }

  async getWarehouse(id: string): Promise<Warehouse> {
    const result = await this.db
      .get({
        TableName: this.tableName,
        Key: { id },
      })
      .promise();
    
    return result.Item as Warehouse;
  }

  async createWarehouse(warehouse: Warehouse): Promise<Warehouse> {
    warehouse.id = v4();

    await this.db
      .put({
        TableName: this.tableName,
        Item: warehouse,
      })
      .promise();

    return warehouse;
  }

  async updateWarehouse(warehouse: Partial<Warehouse>): Promise<Warehouse> {
    const updated = await this.db
      .update({
        TableName: this.tableName,
        Key: { id: warehouse.id },
        UpdateExpression:
          'set #name = :name, #longitude = :longitude, #latitude = :latitude, #altitude = :altitude',
        ExpressionAttributeValues: {
          ':name': warehouse.name,
          ':longitude': warehouse.longitude,
          ':latitude': warehouse.latitude,
          ':altitude': warehouse.altitude
        },
        ExpressionAttributeNames: {
          '#name': 'name',
          '#longitude': 'longitude',
          '#latitude': 'latitude',
          '#altitude': 'altitude'
        },
        ReturnValues: 'ALL_NEW',
      })
      .promise();

    return updated.Attributes as Warehouse;
  }

  async deleteWarehouse(id: string) {
    return this.db
      .delete({
        TableName: this.tableName,
        Key: { id },
      })
      .promise();
  }
}
