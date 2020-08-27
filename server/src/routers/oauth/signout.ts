import env from '../../env';
import { Request, Response, NextFunction } from 'express';

env();

const signout = (req: Request, res: Response, next: NextFunction) => {
  const userInfo = req.session.map_sign_user_info;

  if (userInfo) {
    req.session.destroy((error: Error) => {
      if (error) {
        next(error);
      }
    });
    res.redirect(process.env.SITE_URL);
  } else {
    next(new Error('already Sign Out'));
  }
};

export default signout;
