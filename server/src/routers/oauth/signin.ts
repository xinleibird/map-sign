import { Request, Response, NextFunction } from 'express';

const signin = (req: Request, res: Response, next: NextFunction) => {
  const userInfo = req.session.map_sign_user_info;

  if (userInfo) {
    res.json(userInfo);
  } else {
    next(new Error('Need Sign In'));
  }
};

export default signin;
