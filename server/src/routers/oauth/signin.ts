import env from '../../env';
import { Request, Response, NextFunction } from 'express';

env();

const signin = async (req: Request, res: Response, next: NextFunction) => {
  const userInfo = req.session.map_sign_user_info;

  if (userInfo) {
    res.json(userInfo);
  } else {
    next(new Error('Not Sign In yet!'));
  }
};

export default signin;
