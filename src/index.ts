import express from 'express';
import * as dotenv from 'dotenv';
import createDynamoDBClient from './db';

import { AuthorizationController } from './controllers/authorization';

dotenv.config({ path: '.env' });

const app = express();

app.use(express.json());
const db = createDynamoDBClient();

app.use(new AuthorizationController(db).getRouter());

app.listen(process.env.PORT);
