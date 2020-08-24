import { Request, Response, NextFunction } from 'express';

export const notFound = (req: Request, res: Response, next: NextFunction) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.statusCode = 404;
  next(error);
};

export const handleErrors = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.statusCode = statusCode;
  res.json({
    message: error.message,
    stack: process.env.NODE_ENV === 'development' ? error.stack : '👽',
  });
};
