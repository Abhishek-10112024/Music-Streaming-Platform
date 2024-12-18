import Playlist from '../models/Playlist.js';
import Song from '../models/Song.js';

// Create a new playlist
export const createPlaylist = async (req, res) => {
    const { name, description } = req.body;

    try {
        const playlist = await Playlist.create({
            name,
            description,
            createdBy: req.user.id,
        });

        res.status(201).json({ message: 'Playlist created successfully', playlist });
    } catch (err) {
        res.status(500).json({ message: 'Error creating playlist', error: err });
    }
};

// Add a song to a playlist
export const addSongToPlaylist = async (req, res) => {
    const { playlistId, songId } = req.body;

    try {
        const playlist = await Playlist.findByPk(playlistId);
        if (!playlist || playlist.createdBy !== req.user.id) {
            return res.status(404).json({ message: 'Playlist not found or access denied' });
        }

        const song = await Song.findByPk(songId);
        if (!song || song.deleted) {
            return res.status(404).json({ message: 'Song not found or deleted' });
        }

        await playlist.addSong(song);
        res.status(200).json({ message: 'Song added to playlist successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Error adding song to playlist', error: err });
    }
};

// Remove a song from a playlist
export const removeSongFromPlaylist = async (req, res) => {
    const { playlistId, songId } = req.body;

    try {
        const playlist = await Playlist.findByPk(playlistId);
        if (!playlist || playlist.createdBy !== req.user.id) {
            return res.status(404).json({ message: 'Playlist not found or access denied' });
        }

        const song = await Song.findByPk(songId);
        if (!song) {
            return res.status(404).json({ message: 'Song not found' });
        }

        await playlist.removeSong(song);
        res.status(200).json({ message: 'Song removed from playlist' });
    } catch (err) {
        res.status(500).json({ message: 'Error removing song from playlist', error: err });
    }
};

// Delete a playlist
export const deletePlaylist = async (req, res) => {
    const { playlistId } = req.params;

    try {
        const playlist = await Playlist.findByPk(playlistId);
        if (!playlist || playlist.createdBy !== req.user.id) {
            return res.status(404).json({ message: 'Playlist not found or access denied' });
        }

        await playlist.update({ deleted: true });
        res.status(200).json({ message: 'Playlist deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Error deleting playlist', error: err });
    }
};


// Get list of playlists created by the logged-in user
export const getUserPlaylists = async (req, res) => {
    try {
        const playlists = await Playlist.findAll({
            where: { createdBy: req.user.id, deleted: false }, 
        });

        if (!playlists || playlists.length === 0) {
            return res.status(404).json({ message: 'No playlists found for this user.' });
        }

        res.status(200).json({ playlists });
    } catch (err) {
        res.status(500).json({ message: 'Error retrieving playlists', error: err });
    }
};


// Get list of songs in a playlist
export const getPlaylistSongs = async (req, res) => {
    const { playlistId } = req.params;

    try {
        const playlist = await Playlist.findByPk(playlistId);

        if (!playlist || playlist.createdBy !== req.user.id) {
            return res.status(404).json({ message: 'Playlist not found or access denied' });
        }

        const songs = await playlist.getSongs({
            where: { deleted: false }
        });

        if (!songs || songs.length === 0) {
            return res.status(404).json({ message: 'No songs found in this playlist' });
        }

        res.status(200).json({ songs });
    } catch (err) {
        res.status(500).json({ message: 'Error retrieving songs from playlist', error: err });
    }
};


// Get the list of liked songs from the "Liked Songs" playlist
export const getLikedSongs = async (req, res) => {
    try {
        const playlist = await Playlist.findOne({
            where: { createdBy: req.user.id, name: 'Liked Songs', deleted: false },
            include: {
                model: Song,
                where: { deleted: false }, 
                through: { attributes: [] }, // Exclude the junction table data
            },
        });

        if (!playlist) {
            return res.status(404).json({ message: 'Liked Songs playlist not found for this user' });
        }

        res.status(200).json({ songs: playlist.Songs });
    } catch (err) {
        res.status(500).json({ message: 'Error retrieving liked songs', error: err });
    }
};

// Add song to the "Liked Songs" playlist
export const addSongToLikedList = async (req, res) => {
    const { songId } = req.body;

    try {
        let playlist = await Playlist.findOne({
            where: { createdBy: req.user.id, name: 'Liked Songs', deleted: false },
        });

        if (!playlist) {
            playlist = await Playlist.create({
                name: 'Liked Songs',
                description: 'Songs that you liked',
                createdBy: req.user.id,
            });
        }

        const song = await Song.findByPk(songId);
        if (!song || song.deleted) {
            return res.status(404).json({ message: 'Song not found or deleted' });
        }

        await playlist.addSong(song);

        res.status(200).json({ message: 'Song added to liked list' });
    } catch (err) {
        res.status(500).json({ message: 'Error adding song to liked list', error: err });
    }
};

// Remove song from the "Liked Songs" playlist
export const removeSongFromLikedList = async (req, res) => {
    const { songId } = req.body;

    try {
        const playlist = await Playlist.findOne({
            where: { createdBy: req.user.id, name: 'Liked Songs', deleted: false },
        });

        if (!playlist) {
            return res.status(404).json({ message: 'Liked Songs playlist not found for this user' });
        }

        const song = await Song.findByPk(songId);
        if (!song) {
            return res.status(404).json({ message: 'Song not found' });
        }

        await playlist.removeSong(song);

        res.status(200).json({ message: 'Song removed from liked list' });
    } catch (err) {
        res.status(500).json({ message: 'Error removing song from liked list', error: err });
    }
};
