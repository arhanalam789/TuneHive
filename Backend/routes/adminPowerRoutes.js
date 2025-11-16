import experss from 'express';

const router = experss.Router();

import { addSong,getAllSongs } from '../controllers/adminPowerController.js';
import upload from '../middleware/multerConfig.js';

router.post(
    "/upload-song",
    upload.fields([
      { name: "audio", maxCount: 1 },
      { name: "image", maxCount: 1 }
    ]),
    addSong
  );
  router.get("/all-songs", getAllSongs);
export default router;