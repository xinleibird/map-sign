import { Router, Request } from 'express';
import ExpressBrute, { MemoryStore } from 'express-brute';
import MongoStore from 'express-brute-mongoose';
import BruteForceSchema from 'express-brute-mongoose/dist/schema';
import mongoose from 'mongoose';
import env from '../../env';

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

const model = mongoose.model('bruteforce', new mongoose.Schema(BruteForceSchema));

const memoryStroe = new MemoryStore();
const mongoStore = new MongoStore(model);

const readLimiter = new ExpressBrute(memoryStroe, {
  minWait: 100,
  maxWait: 2000,
  failCallback,
});

const writeLimiter = new ExpressBrute(mongoStore, { minWait: 15000, failCallback });

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
