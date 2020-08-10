import { Router } from 'express';

import signs from './signs';

const router = Router();

router.use(signs);

export default router;
