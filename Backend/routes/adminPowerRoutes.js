import experss from 'express';


const router = experss.Router();

import { addSong,getAllSongs,addPlaylist,getAllPlaylists,getPlaylistById,updatePlaylistSongs,deleteSong,editSong ,getDashboardStats,updatePlaylistDetails,deletePlaylist} from '../controllers/adminPowerController.js';
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



  router.post(
    "/add-playlist",
    upload.single("coverImage"),
    addPlaylist
  );
  

  router.get("/all-playlists", getAllPlaylists);


  router.get("/playlist/:id", getPlaylistById);

  router.put("/playlist/:id/songs", updatePlaylistSongs);

  router.delete("/delete-song/:id", deleteSong);
  router.put("/edit-song/:id", editSong);

  router.get("/stats", getDashboardStats);


  router.put(
    "/playlist/:id/edit",
    upload.single("coverImage"),
    updatePlaylistDetails
  );
  
  router.delete("/playlist/:id/delete", deletePlaylist);


export default router;

