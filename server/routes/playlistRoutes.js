import express from 'express';
import { createPlaylist, addSongToPlaylist, removeSongFromPlaylist, deletePlaylist, getUserPlaylists, getPlaylistSongs } from '../controllers/playlistController.js';
import { getLikedSongs, addSongToLikedList, removeSongFromLikedList } from '../controllers/playlistController.js';
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

// Get the list of playlists created by the logged-in user
router.get('/my-playlists', userAuthentication, getUserPlaylists);

// Get the list of songs in a playlist created by the logged-in user
router.get('/:playlistId/songs', userAuthentication, getPlaylistSongs);

// Get the list of liked songs
router.get('/liked-songs', userAuthentication, getLikedSongs);

// Add a song to the liked list
router.post('/liked-songs/add', userAuthentication, addSongToLikedList);

// Remove a song from the liked list
router.post('/liked-songs/remove', userAuthentication, removeSongFromLikedList);

export default router;
