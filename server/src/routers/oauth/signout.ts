import { NextFunction, Request, Response } from 'express';

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
    next(new Error('Already Sign Out'));
  }
};

export default signout;
