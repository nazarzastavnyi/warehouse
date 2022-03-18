import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import bcrypt from 'bcryptjs';
import randomstring from 'randomstring';
import { User, UserResponse } from '../models/User';
import { Token, ErrorResponse } from '../models/Main';

export class AuthorizationService {
  private db : DocumentClient;
  private tableName = 'User';

  constructor(db: DocumentClient) {
    this.db = db;
  }

  async getUserByToken(token: string): Promise<DocumentClient.GetItemOutput> {
    return this.db
      .get({
        TableName: this.tableName,
        Key: {token},
      })
      .promise();
  }

  async singUp(user: User): Promise<UserResponse | ErrorResponse> {
    const isExist = await this.db
      .get({
        TableName: this.tableName,
        Key: { login: user.login },
      })
      .promise();

    if (isExist.Item) {
      return {
        status: 403,
        message: 'User already created'
      };
    }

    user.password = bcrypt.hashSync(user.password, 10);

    await this.db.put({
      TableName: this.tableName,
      Item: user
    }).promise();

    return {
      login: user.login
    };
  }

  async singIn(user: User): Promise<Token | ErrorResponse> {
    const savedUser = await this.db
      .get({
        TableName: this.tableName,
        Key: { login: user.login },
      })
      .promise();
    if (bcrypt.compare(savedUser.Item.password, user.password)) {
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
    const savedUser = await this.db
      .get({
        TableName: this.tableName,
        Key: tokens,
      })
      .promise();

    if (!savedUser.Item) {
      return {
        status: 403,
        message: 'Tokens is wrong'
      };
    }

    const new_token = randomstring.generate(16);
    const refresh_token = randomstring.generate(16);

    return this.updateTokens(savedUser.Item.login, new_token, refresh_token);
  }

  async logout(token: string) {
    const savedUser = await this.getUserByToken(token);

    return this.updateTokens(savedUser.Item.login, null, null);
  }


  private updateTokens(login: string, token: string, refresh_token: string): Token {

    this.db.update({
      TableName: this.tableName,
      Key: { login },
      UpdateExpression:
          'set token = :token, token_reset = :token_reset',
      ExpressionAttributeValues: {
        ':token': token,
        ':token_reset': refresh_token
      },
      ReturnValues: 'ALL_NEW',
    }).promise();

    return {
      token,
      refresh_token
    };
  }
}
