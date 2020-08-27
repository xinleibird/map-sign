import cors, { CorsOptions } from 'cors';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import { handleAccess, handleErrors, handleNotFound } from './middleware';
import { api, db, oauth } from './routers';
import session from './session';
import startServer from './startServer';

const app = express();

const corsOptions: CorsOptions = {
  origin: JSON.parse(process.env.CORS_ORIGIN!),
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
};

// Request logs, Header security and CORS
app.use(morgan('common')).use(helmet()).use(cors(corsOptions)).use(express.json());

// Session
app.use(session);

// Router
// For POST PUT DELETE, Verify Access, Vertify Authorization
app.use(oauth).use(db).use(handleAccess).use(api);

// 404 and Error handler
app.use(handleNotFound).use(handleErrors);

startServer(app);
