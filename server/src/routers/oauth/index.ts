import { Router } from 'express';
import redirect from './redirect';
import signin from './signin';
import signout from './signout';

const router = Router();

router
  .use('/oauth/redirect', redirect)
  .use('/oauth/signin', signin)
  .use('/oauth/signout', signout);

export default router;
