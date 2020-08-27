import { Router } from 'express';
import redirect from './redirect';
import signin from './signin';

const router = Router();

router.use('/oauth/redirect', redirect).use('/oauth/signin', signin);

export default router;
