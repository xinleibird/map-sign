import cors, { CorsOptions } from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import { readFileSync } from 'fs';
import helmet from 'helmet';
import morgan from 'morgan';
import api from './api';
import { handleErrors, notFound } from './middleware';
import http from 'http';
import https from 'https';

if (process.env.NODE_ENV === 'development') {
  dotenv.config({ path: './.development' });
} else {
  dotenv.config();
}

const app = express();

const corsOptions: CorsOptions = {
  origin: JSON.parse(process.env.CORS_ORIGIN!),
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
};

// Request logs, Header security and CORS
app.use(morgan('common')).use(helmet()).use(cors(corsOptions)).use(express.json());

app.use('/api', api);

// 404 and Error handler
app.use(notFound).use(handleErrors);

if (process.env.NODE_ENV === 'development') {
  const httpServer = http.createServer(app);
  const port = process.env.HTTP_PORT;
  httpServer.listen(port, () => {
    console.log(`Server has been started at http://localhost:${port}`);
  });
} else {
  const key = readFileSync(process.env.KEY_PATH, 'utf8');
  const cert = readFileSync(process.env.CERT_PATH, 'utf8');
  const ca = readFileSync(process.env.CHAIN_PATH, 'utf8');
  const credentials = {
    key,
    cert,
    ca,
  };
  const httpsServer = https.createServer(credentials, app);
  const port = process.env.HTTPS_PORT;
  httpsServer.listen(port, () => {
    console.log(`Server has been started at https://localhost:${port}`);
  });
}
