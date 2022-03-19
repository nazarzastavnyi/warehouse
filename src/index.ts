import * as dotenv from 'dotenv';
dotenv.config({ path: '.env' });

import express from 'express';
import createDynamoDBClient from './db';

import { AuthorizationController } from './controllers/authorization';

const app = express();

app.use(express.json());
const db = createDynamoDBClient();

app.use(new AuthorizationController(db).getRouter());

app.listen(process.env.PORT);
