import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import bcrypt from 'bcryptjs';
import randomstring from 'randomstring';
import { UserRequest } from '../interfaces/User';
import { Token, ErrorResponse } from '../interfaces/Main';

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

  async singUp(user: UserRequest): Promise<DocumentClient.GetItemOutput | ErrorResponse> {

    const isExist = await this.db
      .get({
        TableName: this.tableName,
        Key: {
          login: user.login
        },
      })
      .promise();

    if (isExist.Item) {
      return {
        status: 403,
        message: 'User already created'
      };
    }

    user.password = bcrypt.hashSync(user.password, 10);

    return this.db.put({
      TableName: this.tableName,
      Item: user,
    }).promise();
  }

  async singIn(user: UserRequest): Promise<Token | ErrorResponse> {
    const savedUser = await this.db
      .get({
        TableName: this.tableName,
        Key: { login: user.login },
      })
      .promise();
    const isLogin = await bcrypt.compare(savedUser.Item.password, user.password);
    if (isLogin) {
      return {
        status: 401,
        message: 'Wrong login or password'
      };
    }
    const token = randomstring.generate(16);
    const refresh_token = randomstring.generate(16);

    return this.updateTokens(user.login, token, refresh_token);
  }

  async refreshToken(tokens: Token) {
    const savedUser = await this.getUserByToken(tokens.token);
    console.log(savedUser)

    if (!savedUser.Items[0] || savedUser.Items[0].refresh_token !== tokens.refresh_token) {
      return {
        status: 403,
        message: 'Tokens is wrong'
      };
    }

    const new_token = randomstring.generate(16);
    const refresh_token = randomstring.generate(16);

    return this.updateTokens(savedUser.Items[0].login, new_token, refresh_token);
  }

  async logout(login: string, token: string) {

    return this.updateTokens(login, token, null);
  }


  private async updateTokens(login: string, token: string, refresh_token: string): Promise<Token> {

    await this.db.update({
      TableName: this.tableName,
      Key: { login },
      UpdateExpression:
          'set #token = :token, #refresh_token = :refresh_token',
      ExpressionAttributeValues: {
        ':token': token,
        ':refresh_token': refresh_token
      },
      ExpressionAttributeNames: {
        '#token': 'token',
        '#refresh_token': 'refresh_token'
      },
      ReturnValues: 'ALL_NEW',
    }).promise();

    return {
      token,
      refresh_token
    };
  }
}
