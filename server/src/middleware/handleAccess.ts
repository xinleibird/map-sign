import { Request, Response, NextFunction } from 'express';

const handleAccess = (req: Request, res: Response, next: NextFunction) => {
  if (req.method === 'POST' || req.method === 'PUT' || req.method === 'DELETE') {
    if (req.session.map_sign_user_info) {
      next();
    } else {
      next(new Error('Denied!'));
    }
  } else {
    next();
  }
};

export default handleAccess;
