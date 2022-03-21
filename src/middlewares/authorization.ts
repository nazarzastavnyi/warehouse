
   
import { Request, Response, NextFunction } from 'express';
import { AuthorizationService } from '../services/authorization';
import { BasicError } from '../utils/error';
import { DocumentClient } from 'aws-sdk/clients/dynamodb';

export class AuthorizationMiddleware {
  private db: DocumentClient;

  async authMiddleware(request: Request, response: Response, next: NextFunction) {
    try {
      const token = request.headers['authorization']?.split('Bearer ')[1];
      const authError = new BasicError(401, 'token is not valid');

      if (!token) {
        throw authError;
      }
      const service: AuthorizationService = new AuthorizationService(this.db);

      const isExist = await service.getUserByToken(token);

      if (!isExist.Items[0]?.is_auth) {
        throw authError;
      }

      request.login = isExist.Items[0].login;

      next();
    } catch (err) {
      next(err);
    }
  }
}
