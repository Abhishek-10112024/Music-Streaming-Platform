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

        await playlist.destroy();
        res.status(200).json({ message: 'Playlist deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Error deleting playlist', error: err });
    }
};

