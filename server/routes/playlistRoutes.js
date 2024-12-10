import express from 'express';
import { createPlaylist, addSongToPlaylist } from '../controllers/playlistController.js';
import { userAuthentication } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/create', userAuthentication, createPlaylist);                      // Create new playlist
router.post('/add-song',userAuthentication, addSongToPlaylist);                 // Add song to playlist

export default router;
