import { Request, Response, NextFunction } from 'express';

const handleNotFound = (req: Request, res: Response, next: NextFunction) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

export default handleNotFound;
