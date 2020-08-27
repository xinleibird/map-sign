import { Router, Request } from 'express';
import ExpressBrute, { MemoryStore } from 'express-brute';
import mongoose from 'mongoose';
import env from '../../env';
import RedisStore from 'express-brute-redis';

env();

const router = Router();

mongoose.connect(process.env.DB_URL, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
  useCreateIndex: true,
});

const failCallback = (req: Request, res, next, nextData) => {
  console.log(`${req.ip} request too many with ${req.method} - ${req.path}`);
  next(new Error('too many request'));
};

const redisStore = new RedisStore();

const readLimiter = new ExpressBrute(redisStore, {
  freeRetries: 3,
  minWait: 1000,
  maxWait: 2000,
  failCallback,
});

const writeLimiter = new ExpressBrute(redisStore, {
  freeRetries: 1,
  minWait: 1000,
  maxWait: 1000 * 6,
  failCallback,
});

router.get('*', readLimiter.prevent, (req, res, next) => {
  next();
});

router.post('*', writeLimiter.prevent, (req, res, next) => {
  next();
});

router.put('*', writeLimiter.prevent, (req, res, next) => {
  next();
});

router.delete('*', writeLimiter.prevent, (req, res, next) => {
  next();
});

export default router;
