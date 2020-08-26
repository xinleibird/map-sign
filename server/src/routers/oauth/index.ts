import { Router } from 'express';
import redirect from './redirect';

const router = Router();

router.use('/oauth', redirect);

export default router;
