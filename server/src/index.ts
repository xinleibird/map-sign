import cors, { CorsOptions } from 'cors';
import express from 'express';
import session, { SessionOptions } from 'express-session';
import helmet from 'helmet';
import morgan from 'morgan';
import env from './env';
import { handleErrors, notFound } from './middleware';
import { api, oauth, db } from './routers';
import startServer from './startServer';

env();

const app = express();

const corsOptions: CorsOptions = {
  origin: JSON.parse(process.env.CORS_ORIGIN!),
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
};

export const cookieOptions = {
  secure: process.env.NODE_ENV !== 'development', // just https set this
  maxAge: process.env.NODE_ENV === 'development' ? 1000 * 60 * 2 : 1000 * 60 * 60 * 24 * 7,
  domain: process.env.COOKIE_DOMAIN,
};

const sessionOptions: SessionOptions = {
  secret: process.env.SESSION_SECRET,
  saveUninitialized: false,
  resave: true,
  cookie: cookieOptions,
  name: 'map_sign_session',
};

// Request logs, Header security and CORS
app.use(morgan('common')).use(helmet()).use(cors(corsOptions)).use(express.json());

// Session
app.use(session(sessionOptions));

// For POST PUT DELETE, Verify Access, Vertify Authorization
// app.use(handleAccess).use(handleAuth);

// Router
app.use(db).use(api).use(oauth);

// 404 and Error handler
app.use(notFound).use(handleErrors);

startServer(app);
