import { Router } from 'express';
import redirect from './redirect';

const router = Router();

router.use(redirect);

export default router;
