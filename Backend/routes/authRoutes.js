import express from "express";

const router = express.Router();

import { registerUser, loginUser, logoutUser, isAuthenticated } from "../controllers/authController.js"
import {sendOtp} from "../controllers/authController.js";
import { verifyOtp } from "../controllers/authController.js";
import { resetpassword } from "../controllers/authController.js";

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/logout', logoutUser);
router.post('/sendotp', sendOtp);
router.post('/verifyotp', verifyOtp);
router.post('/resetpassword', resetpassword);

router.get("/verify", isAuthenticated);

export default router;