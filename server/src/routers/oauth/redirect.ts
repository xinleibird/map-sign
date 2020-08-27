import axios from 'axios';
import { NextFunction, Request, Response } from 'express';

const redirect = async (req: Request, res: Response, next: NextFunction) => {
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
};

export default redirect;
