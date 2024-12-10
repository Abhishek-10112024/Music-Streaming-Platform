import express from 'express';
import { addSong, saveSong, getAllSongs, reportSong, likeSong } from '../controllers/songController.js';
import { userAuthentication } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/upload', userAuthentication, addSong, saveSong);   // Upload song route
router.get('/songs', userAuthentication, getAllSongs);            // Fetch all songs
router.post('/report',userAuthentication, reportSong);           // Report a song
router.post('/like',userAuthentication, likeSong);               // Like a song

export default router;
