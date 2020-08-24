import axios from 'axios';
import { Router } from 'express';
import env from '../env';
env();

const router = Router();

router.get('/redirect', async (req, res, next) => {
  try {
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

    const result = await axios({
      url: 'https://api.github.com/user',
      headers: {
        accept: 'application/json',
        Authorization: `token ${accessToken}`,
      },
    });
    console.log(result.data);
  } catch (e) {
    next(e);
  }
  // res.status(302);
  // res.send(`
  //   <head>
  //     <meta http-equiv="Refresh" content="0; URL=https://www.google.com/" />
  //   </head>
  // `);
});

export default router;
