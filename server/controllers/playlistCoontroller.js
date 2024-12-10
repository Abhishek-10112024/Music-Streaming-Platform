import Playlist from '../models/Playlist.js';
import Song from '../models/Song.js';
import PlaylistSong from '../models/PlaylistSong.js';

// Create a new playlist
export const createPlaylist = async (req, res) => {
    try {
        const { name, description, userId } = req.body;

        const newPlaylist = await Playlist.create({
            name,
            description,
            userId,
        });

        res.status(201).json({ message: 'Playlist created', playlist: newPlaylist });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Error creating playlist' });
    }
};

// Add a song to the playlist
export const addSongToPlaylist = async (req, res) => {
    try {
        const { playlistId, songId } = req.body;

        const playlist = await Playlist.findByPk(playlistId);
        const song = await Song.findByPk(songId);

        if (!playlist || !song) {
            return res.status(404).json({ message: 'Playlist or song not found' });
        }

        // Add song to playlist via the PlaylistSong join table
        await PlaylistSong.create({ playlistId, songId });
        res.status(200).json({ message: 'Song added to playlist' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Error adding song to playlist' });
    }
};
