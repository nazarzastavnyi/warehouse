import * as dotenv from 'dotenv';
dotenv.config({ path: '.env' });

import express from 'express';
import createDynamoDBClient from './db';
import { errorHandler } from './middlewares/error';

import { AuthorizationController } from './controllers/authorization';
import { WarehouseController } from './controllers/warehouse';

const app = express();

app.use(express.json());
const db = createDynamoDBClient();

app.use(new AuthorizationController(db).getRouter());
app.use(new WarehouseController(db).getRouter());
app.use(errorHandler);

app.listen(process.env.PORT);
