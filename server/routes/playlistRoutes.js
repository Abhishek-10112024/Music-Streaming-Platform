import express from 'express';
import { createPlaylist, addSongToPlaylist, removeSongFromPlaylist, deletePlaylist } from '../controllers/playlistController.js';
import { userAuthentication } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Create a new playlist
router.post('/', userAuthentication, createPlaylist);

// Add a song to a playlist
router.post('/add-song', userAuthentication, addSongToPlaylist);

// Remove a song from a playlist
router.post('/remove-song', userAuthentication, removeSongFromPlaylist);

// Delete a playlist
router.delete('/:playlistId', userAuthentication, deletePlaylist);

export default router;
