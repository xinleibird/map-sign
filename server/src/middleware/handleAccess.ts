import { Request, Response, NextFunction } from 'express';

const handleAccess = (req: Request, res: Response, next: NextFunction) => {
  if (req.method === 'POST' || req.method === 'PUT' || req.method === 'DELETE') {
    if (req.session.map_sign_user_info) {
      console.log(1);
    } else {
      console.log(2);
    }
  }
  next();
};

export default handleAccess;
