import { Router } from 'express';
import axios from 'axios';
import dotenv from 'dotenv';

if (process.env.NODE_ENV === 'development') {
  dotenv.config({ path: './.development' });
} else {
  dotenv.config();
}

const router = Router();



router.get('/redirect', async (req, res, next) => {
  try {
    const requestToken = req.query.code;
    let githubAccessURL =
    'https://github.com/login/oauth/access_token?' +
    `client_id=${process.env.GITHUB_CLIENT_ID}&` +
    `client_secret=${process.env.GITHUB_CLIENT_SECRET}&` +
    `code=${requestToken}`;
    const responseToken = await axios({
      url: githubAccessURL,
      headers: { accept: 'application/json' },
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
