import cors, { CorsOptions } from 'cors';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import { handleErrors, notFound } from './middleware';

const app = express();

const port = process.env.PORT || 1717;

const corsOptions: CorsOptions = {
  origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
  methods: ['GET', 'POST'],
};

// Request logs, Header security and CORS
app.use(morgan('common')).use(helmet()).use(cors(corsOptions));

// routers
app.get('/', (req, res) => {
  res.json({
    message: 'hello',
  });
});

// 404 and Error handler
app.use(notFound).use(handleErrors);

app.listen(port, () => {
  console.log(`Server has been started at http://localhost:${port}`);
});
