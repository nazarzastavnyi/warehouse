import { Router, Request, Response, NextFunction } from 'express';
import { UserRequest } from '../interfaces/User';
import { Token } from '../interfaces/Token';
import { AuthorizationService } from '../services/authorization';
import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import { AuthorizationMiddleware } from '../middlewares/authorization';

export class AuthorizationController {
  private router: Router;
  private service: AuthorizationService;
  private middleware: AuthorizationMiddleware;
  private db: DocumentClient;

  constructor(db: DocumentClient) {
    this.router = Router();
    this.db = db;
    this.service = new AuthorizationService(db);
    this.middleware = new AuthorizationMiddleware();
    
    this.initializeRoutes();
  }

  public getRouter() {
    return this.router;
  }

  private initializeRoutes() {
    this.router.post('/singUp', this.singUp);
    this.router.post('/singIn', this.singIn);
    this.router.post('/refreshToken', this.refreshToken);
    this.router.post('/logout', this.middleware.authMiddleware.bind(this), this.logout);
  }

  private singUp = async (request: Request, response: Response, next: NextFunction) => {
    try {
      const userData: UserRequest = request.body;

      const result = await this.service.singUp(userData);

      response.send(result);
      
    } catch (error) {
      next(error);
    }
  };


  private singIn = async (request: Request, response: Response, next: NextFunction) => {
    try {
      const userData: UserRequest = request.body;

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
      const result = await this.service.logout(request.login);

      response.send(result);
    } catch (error) {
      next(error);
    }
  };
}
