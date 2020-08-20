import { Router } from 'express';
import mongoose from 'mongoose';
import { MapSign } from '../models/SignEntry';

const router = Router();

mongoose.connect(process.env.DB_URL || 'mongodb://localhost/test', {
  useUnifiedTopology: true,
  useNewUrlParser: true,
});

router.get('/signs/:id', async (req, res, next) => {
  try {
    res.status(202);
    const sign = await MapSign.findOne({ _id: req.params.id });
    res.status(200);
    res.json(sign);
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
    res.json(sign);
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
    res.json(sign);
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
    res.json(signs);
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
    res.json(createdEntry);
  } catch (error) {
    console.log(error.name);
    if (error.name === 'ValidationError') {
      res.status(422);
    }
    next(error);
  }
});

export default router;