import { Router } from 'express';

import signs from './signs';

const router = Router();

router.use('/api', signs);

export default router;
