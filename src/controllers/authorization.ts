import { Router, Request, Response, NextFunction } from 'express';
import { User } from '../models/User';
import { Token } from '../models/Main';
import { AuthorizationService } from '../services/authorization';
import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import { AuthorizationMiddleware } from '../middlewares/authorization';

export class AuthorizationController {
  private router: Router;
  private service: AuthorizationService;
  private middleware: AuthorizationMiddleware;

  constructor(db: DocumentClient) {
    this.router = Router();
    this.service = new AuthorizationService(db);
    this.middleware = new AuthorizationMiddleware(this.service);
    
    this.initializeRoutes();
  }

  public getRouter() {
    return this.router;
  }

  private initializeRoutes() {
    this.router.post('/singUp', this.singUp);
    this.router.post('/singIn', this.singIn);
    this.router.post('/refreshToken', this.refreshToken);
    this.router.post('/logout', this.middleware.authMiddleware, this.logout);
  }

  private singUp = async (request: Request, response: Response, next: NextFunction) => {
    try {
      const userData: User = request.body;

      const result = await this.service.singUp(userData);

      response.send(result);
      
    } catch (error) {
      next(error);
    }
  };


  private singIn = async (request: Request, response: Response, next: NextFunction) => {
    try {
      const userData: User = request.body;

      const result = await this.service.singIn(userData);

      response.send(result);
      
    } catch (error) {
      next(error);
    }
  };

  private refreshToken = async (request: Request, response: Response, next: NextFunction) => {
    try {
      const tokenData: Token = request.body;

      const result = await this.service.refreshToken(tokenData);

      response.send(result);
      
    } catch (error) {
      next(error);
    }
  };

  private logout = async (request: Request, response: Response, next: NextFunction) => {
    try {

      const result = await this.service.logout(request.body.token);

      response.send(result);
    } catch (error) {
      next(error);
    }
  };
}