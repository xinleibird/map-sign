import { Request, Response, NextFunction } from 'express';

const handleErrors = (error: Error, req: Request, res: Response, next: NextFunction) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode);

  res.json({
    message: error.message,
    stack: process.env.NODE_ENV === 'development' ? error.stack : '👽',
  });
};

export default handleErrors;
