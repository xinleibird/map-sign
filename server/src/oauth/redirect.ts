import { Router } from 'express';

const router = Router();

let githubAccessURL =
  'https://github.com/login/oauth/access_token?' +
  `client_id=${process.env.GITHUB_CLIENT_ID}&` +
  `client_secret=${process.env.GITHUB_CLIENT_SECRET}&`;

router.get('/redirect', async (req, res, next) => {
  try {
    const requestToken = req.query.code;
    githubAccessURL += `code=${requestToken}`;
    const responseTokenPromise = await fetch(githubAccessURL, {
      headers: { accept: 'application/json' },
    });
    const responseToken = await responseTokenPromise.json();

    const accessToken = responseToken.data.access_token;

    const result = await fetch('https://api.github.com/user', {
      headers: {
        accept: 'application/json',
        Authorization: `token ${accessToken}`,
      },
    });
    console.log(result);
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
