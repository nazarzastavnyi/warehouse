import { Router, Request, Response, NextFunction } from 'express';
import { AuthorizationMiddleware } from '../middlewares/authorization';
import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import { WarehouseService } from '../services/warehouse';
import { Warehouse } from '../interfaces/Warehouse';
import { BasicError } from '../utils/error'

export class WarehouseController {
  private router: Router;
  private service: WarehouseService;
  private middleware: AuthorizationMiddleware;
  private db: DocumentClient;

  constructor(db: DocumentClient) {
    this.router = Router();
    this.db = db;
    this.service = new WarehouseService(db);
    this.middleware = new AuthorizationMiddleware();
    
    this.initializeRoutes();
  }

  public getRouter() {
    return this.router;
  }

  private initializeRoutes() {
    this.router.get('/getAll', this.middleware.authMiddleware.bind(this), this.getAll);
    this.router.get('/:id', this.middleware.authMiddleware.bind(this), this.getById);
    this.router.post('/create', this.middleware.authMiddleware.bind(this), this.create);
    this.router.put('/update', this.middleware.authMiddleware.bind(this), this.update);
    this.router.delete('/:id', this.middleware.authMiddleware.bind(this), this.delete);
  }

  private getAll = async (request: Request, response: Response, next: NextFunction) => {
    try {
      const result = await this.service.getAllWarehouses();

      response.send(result);
      
    } catch (error) {
      next(error);
    }
  };

  private getById = async (request: Request, response: Response, next: NextFunction) => {
    try {
      const result = await this.service.getWarehouse(request.params.id);

      if(!result) throw new BasicError(404, 'Not found');

      response.send(result);
      
    } catch (error) {
      next(error);
    }
  };

  private create = async (request: Request, response: Response, next: NextFunction) => {
    try {
      const warehouse: Warehouse = request.body;
        
      const result = await this.service.createWarehouse(warehouse);

      response.send(result);
      
    } catch (error) {
      next(error);
    }
  };

  private update = async (request: Request, response: Response, next: NextFunction) => {
      try {
        const warehouse: Warehouse = request.body;

        if(!warehouse.id) {
            throw new BasicError(400, 'Id is required');
        }
        
        const result = await this.service.updateWarehouse(warehouse);
  
        response.send(result);
      } catch(error) {
        next(error);
      }
  }

  private delete = async (request: Request, response: Response, next: NextFunction) => {
    try {
      const result = await this.service.deleteWarehouse(request.params.id);

      response.send(result);
      
    } catch (error) {
      next(error);
    }
  };
  
}
