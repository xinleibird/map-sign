import http from 'http';
import https from 'https';
import { readFileSync } from 'fs';
import { Application } from 'express';
import env from './env';

env();

const startServer = (app: Application) => {
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
};

export default startServer;
