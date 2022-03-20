
   
import { Request, Response, NextFunction } from 'express';
import { AuthorizationService } from '../services/authorization';

export class AuthorizationMiddleware {
  private service: AuthorizationService;

  async authMiddleware(request: Request, response: Response, next: NextFunction) {
    const token = request.headers['authorization']?.split('Bearer ')[1];

    if (!token) {
      return response.status(401).send({
        message: 'token is not valid'
      });
    }

    const isExist = await this.service.getUserByToken(token);

    if (!isExist.Items[0]?.refresh_token) {
      return response.status(401).send({
        message: 'token is not valid'
      });
    }

    request.login = isExist.Items[0].login;
    request.token = token;

    next();
  }
}
