import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import bcrypt from 'bcryptjs';
import randomstring from 'randomstring';
import { UserRequest } from '../interfaces/User';
import { Token } from '../interfaces/Token';
import { BasicError } from '../utils/error';

export class AuthorizationService {
  private db : DocumentClient;
  private tableName = 'User';

  constructor(db: DocumentClient) {
    this.db = db;
  }

  async getUserByToken(token: string): Promise<DocumentClient.QueryOutput> {
    return this.db
      .query({
        TableName: this.tableName,
        IndexName : 'token_index',
        KeyConditionExpression : '#token = :token', 
        ExpressionAttributeValues : {
          ':token' : token       
        },
        ExpressionAttributeNames: {
          '#token': 'token',
        }
      })
      .promise();
  }

  async singUp(user: UserRequest): Promise<DocumentClient.GetItemOutput> {

    const isExist = await this.db
      .get({
        TableName: this.tableName,
        Key: {
          login: user.login
        },
      })
      .promise();

    if (isExist.Item) {
      throw new BasicError(403, 'User already exist');
    }

    user.password = bcrypt.hashSync(user.password, 10);

    return this.db.put({
      TableName: this.tableName,
      Item: user,
    }).promise();
  }

  async singIn(user: UserRequest): Promise<Token> {
    const savedUser = await this.db
      .get({
        TableName: this.tableName,
        Key: { login: user.login },
      })
      .promise();
    const isLogin = await bcrypt.compare(savedUser.Item.password, user.password);
    if (isLogin) {
      throw new BasicError(401, 'Wrong credentials');
    }
    const token = randomstring.generate(16);
    const refresh_token = randomstring.generate(16);

    return this.updateTokens(user.login, token, refresh_token);
  }

  async refreshToken(tokens: Token) {
    const savedUser = await this.getUserByToken(tokens.token);

    if (!savedUser.Items[0] || savedUser.Items[0].refresh_token !== tokens.refresh_token) {
      throw new BasicError(403, 'One of token is wrong');
    }

    const new_token = randomstring.generate(16);
    const refresh_token = randomstring.generate(16);

    return this.updateTokens(savedUser.Items[0].login, new_token, refresh_token);
  }

  async logout(login: string) {

    return this.db.update({
      TableName: this.tableName,
      Key: { login },
      UpdateExpression: 'set #is_auth = :is_auth',
      ExpressionAttributeValues: {
        ':is_auth': false,
      },
      ExpressionAttributeNames: {
        '#is_auth': 'is_auth',
      }
    }).promise();
  }


  private async updateTokens(login: string, token: string, refresh_token: string): Promise<Token> {

    await this.db.update({
      TableName: this.tableName,
      Key: { login },
      UpdateExpression:
          'set #token = :token, #refresh_token = :refresh_token, #is_auth = :is_auth',
      ExpressionAttributeValues: {
        ':token': token,
        ':refresh_token': refresh_token,
        ':is_auth': true
      },
      ExpressionAttributeNames: {
        '#token': 'token',
        '#refresh_token': 'refresh_token',
        '#is_auth': 'is_auth'
      },
      ReturnValues: 'ALL_NEW',
    }).promise();

    return {
      token,
      refresh_token
    };
  }
}
