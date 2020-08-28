import { Router } from 'express';
import authentication from './authentication';

const router = Router();

router.use('/oauth', authentication);

export default router;
