
   
import { Request, Response, NextFunction } from 'express';
import { AuthorizationService } from '../services/authorization';

export class AuthorizationMiddleware {
  private authService: AuthorizationService;

  constructor(service: AuthorizationService) {
    this.authService = service;
  }

  async authMiddleware(request: Request, response: Response, next: NextFunction) {
    const token = request.headers['authorization'].split('Bearer ')[1];

    if (!token) {
      return response.status(401).send({
        message: 'token is not valid'
      });
    }

    const isExist = await this.authService.getUserByToken(token);

    if (!isExist.Item) {
      return response.status(401).send({
        message: 'token is not valid'
      });
    }
    next();
  }
}