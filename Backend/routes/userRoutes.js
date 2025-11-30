import express from "express";
import { isAuthenticated } from "../controllers/authController.js";
import { toggleLikeSong, getLikedSongs } from "../controllers/userController.js";

const router = express.Router();

router.post("/toggle-like", isAuthenticated, toggleLikeSong);
router.get("/liked-songs", isAuthenticated, getLikedSongs);

export default router;
