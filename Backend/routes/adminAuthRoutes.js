import express from 'express';

const router = express.Router();

import { adminLogin, adminLogout } from '../controllers/adminAuthController.js';
import { verifyAdmin } from '../controllers/adminAuthController.js';

router.post('/login', adminLogin);
router.post('/logout', adminLogout);
router.get('/verify', verifyAdmin);

export default router;