import { Router } from 'express';
import ExpressBrute from 'express-brute';
import MongoStore from 'express-brute-mongoose';
import BruteForceSchema from 'express-brute-mongoose/dist/schema';
import mongoose from 'mongoose';
import env from '../../env';
import { MapSign } from '../../models/SignEntry';

env();

const router = Router();

router.get('/signs/:id', async (req, res, next) => {
  try {
    res.status(202);
    const sign = await MapSign.findOne({ _id: req.params.id });
    res.status(200);
    res.json({
      message: 'ok',
      result: sign,
    });
  } catch (error) {
    if (error.name === 'CastError') {
      res.status(404);
      error.message = 'The Sign with this ID you are querying does not exist.';
    }
    next(error);
  }
});

router.put('/signs/:id', async (req, res, next) => {
  try {
    res.status(202);
    const sign = await MapSign.findOneAndUpdate({ _id: req.params.id }, req.body);
    res.status(200);
    res.json({
      message: 'ok',
      result: sign,
    });
  } catch (error) {
    console.log(error.name);
    if (error.name === 'CastError') {
      res.status(404);
      error.message = 'The Sign with this ID you are updating does not exist.';
    }
    next(error);
  }
});

router.delete('/signs/:id', async (req, res, next) => {
  try {
    res.status(202);
    const sign = await MapSign.findOneAndDelete({ _id: req.params.id });
    res.status(204);
    res.json({
      message: 'ok',
      result: sign,
    });
  } catch (error) {
    console.log(error.name);
    if (error.name === 'CastError') {
      res.status(404);
      error.message = 'The Sign with this ID you are deleting does not exist.';
    }
    next(error);
  }
});

//
//
//

router.get('/signs', async (req, res, next) => {
  try {
    res.status(202);
    const signs = await MapSign.find();
    res.status(200);
    res.json({
      message: 'ok',
      result: signs,
    });
  } catch (error) {
    res.status(403);
    next(error);
  }
});

router.post('/signs', async (req, res, next) => {
  try {
    const mapSign = new MapSign(req.body);

    res.status(202);
    const createdEntry = await mapSign.save();
    res.status(201);
    res.json({
      message: 'ok',
      result: createdEntry,
    });
  } catch (error) {
    console.log(error.name);
    if (error.name === 'ValidationError') {
      res.status(422);
    }
    next(error);
  }
});

export default router;
