import cors, { CorsOptions } from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import api from './api';
import { handleErrors, notFound } from './middleware';

if (process.env.NODE_ENV === 'development') {
  dotenv.config({ path: './.development' });
} else {
  dotenv.config();
}

const app = express();

const port = process.env.PORT;

const corsOptions: CorsOptions = {
  origin: JSON.parse(process.env.CORS_ORIGIN!),
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
};

// Request logs, Header security and CORS
app.use(morgan('common')).use(helmet()).use(cors(corsOptions)).use(express.json());

app.use('/api', api);

// 404 and Error handler
app.use(notFound).use(handleErrors);

app.listen(port, () => {
  console.log(`Server has been started at http://localhost:${port}`);
});
