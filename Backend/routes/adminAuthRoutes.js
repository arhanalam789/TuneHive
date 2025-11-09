import express from 'express';

const router = express.Router();

import { adminLogin, adminLogout } from '../controllers/adminAuthController.js';

router.post('/login', adminLogin);
router.post('/logout', adminLogout);

export default router;