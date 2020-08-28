import axios from 'axios';
import { NextFunction, Request, Response, Router } from 'express';

const router = Router();

router.use('/redirect', async (req: Request, res: Response, next: NextFunction) => {
  const requestToken = req.query.code;
  const githubAccessURL = 'https://github.com/login/oauth/access_token';
  const responseToken = await axios({
    method: 'POST',
    url: githubAccessURL,
    headers: { accept: 'application/json' },
    data: {
      client_id: process.env.GITHUB_CLIENT_ID,
      client_secret: process.env.GITHUB_CLIENT_SECRET,
      code: requestToken,
    },
  });

  const accessToken = responseToken.data.access_token;

  try {
    const result = await axios({
      url: 'https://api.github.com/user',
      headers: {
        accept: 'application/json',
        Authorization: `token ${accessToken}`,
      },
    });

    const { login, avatar_url, name, html_url } = result.data;
    const userInfo = { login, avatar_url, name, html_url };
    if (!req.session.map_sign_user_info) {
      req.session.map_sign_user_info = {};
    }
    req.session.map_sign_user_info = userInfo;
  } catch (error) {
    next(error);
  }

  res.redirect(process.env.SITE_URL);
});

router.use('/signin', (req: Request, res: Response, next: NextFunction) => {
  const userInfo = req.session.map_sign_user_info;

  if (userInfo) {
    res.json(userInfo);
  } else {
    next(new Error('Need Sign In to edit signs'));
  }
});

router.use('/signout', (req: Request, res: Response, next: NextFunction) => {
  const userInfo = req.session.map_sign_user_info;

  req.session.destroy((error: Error) => {
    if (error) {
      next(error);
    }
  });
  res.status(302);
  res.redirect(process.env.SITE_URL);
});

export default router;
