import express from 'express';
import { uploadSong, streamSong, reportSong, getReportedSongs, resolveReport, deleteSong, getAllSongs, getUserSongs, searchSongs } from '../controllers/songController.js';
import { userAuthentication } from '../middlewares/authMiddleware.js';
import { upload } from '../controllers/songController.js';

const router = express.Router();

// Upload a new song
router.post('/upload', userAuthentication, upload.single('song'), uploadSong);

// Stream a song
router.get('/stream/:songId', userAuthentication, streamSong);

// Report a song
router.post('/report/:songId', userAuthentication, reportSong);

// Get a list of all reported songs (admin only)
router.get('/reports', userAuthentication, getReportedSongs);

// Resolve a song report (admin only)
router.post('/reports/resolve/:reportId', userAuthentication, resolveReport);

// Delete a song (admin only)
router.delete('/:songId', userAuthentication, deleteSong);

// Get a list of all non-deleted and non-reported songs
router.get('/', userAuthentication, getAllSongs);

// Get a list of non-deleted, non-reported songs uploaded by the logged-in user
router.get('/my-songs', userAuthentication, getUserSongs);

// Search for songs by title, artist, album, or genre
router.get('/search', userAuthentication, searchSongs);

export default router;
