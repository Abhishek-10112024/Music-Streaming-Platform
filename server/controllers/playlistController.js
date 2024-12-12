import Playlist from '../models/Playlist.js';
import Song from '../models/Song.js';

// Create a new playlist
export const createPlaylist = (req, res) => {
    const { name, description } = req.body;

    const playlist = new Playlist({
        name,
        description,
        createdBy: req.user.id,
    });

    playlist.save()
        .then(playlist => {
            res.status(201).json({ message: 'Playlist created successfully', playlist });
        })
        .catch(err => {
            res.status(500).json({ message: 'Error creating playlist', error: err });
        });
};

// Add a song to a playlist
export const addSongToPlaylist = (req, res) => {
    const { playlistId, songId } = req.body;

    Playlist.findByPk(playlistId)
        .then(playlist => {
            if (!playlist || playlist.createdBy !== req.user.id) return res.status(404).json({ message: 'Playlist not found or access denied' });

            Song.findByPk(songId)
                .then(song => {
                    if (!song || song.deleted) return res.status(404).json({ message: 'Song not found or deleted' });

                    playlist.addSong(song)
                        .then(() => {
                            res.status(200).json({ message: 'Song added to playlist successfully' });
                        })
                        .catch(err => {
                            res.status(500).json({ message: 'Error adding song to playlist', error: err });
                        });
                })
                .catch(err => {
                    res.status(500).json({ message: 'Error finding song', error: err });
                });
        })
        .catch(err => {
            res.status(500).json({ message: 'Error finding playlist', error: err });
        });
};

// Remove a song from a playlist
export const removeSongFromPlaylist = (req, res) => {
    const { playlistId, songId } = req.body;

    Playlist.findByPk(playlistId)
        .then(playlist => {
            if (!playlist || playlist.createdBy !== req.user.id) return res.status(404).json({ message: 'Playlist not found or access denied' });

            Song.findByPk(songId)
                .then(song => {
                    if (!song) return res.status(404).json({ message: 'Song not found' });

                    playlist.removeSong(song)
                        .then(() => {
                            res.status(200).json({ message: 'Song removed from playlist' });
                        })
                        .catch(err => {
                            res.status(500).json({ message: 'Error removing song from playlist', error: err });
                        });
                })
                .catch(err => {
                    res.status(500).json({ message: 'Error finding song', error: err });
                });
        })
        .catch(err => {
            res.status(500).json({ message: 'Error finding playlist', error: err });
        });
};

// Delete a playlist
export const deletePlaylist = (req, res) => {
    const { playlistId } = req.params;

    Playlist.findByPk(playlistId)
        .then(playlist => {
            if (!playlist || playlist.createdBy !== req.user.id) return res.status(404).json({ message: 'Playlist not found or access denied' });

            playlist.destroy()
                .then(() => {
                    res.status(200).json({ message: 'Playlist deleted successfully' });
                })
                .catch(err => {
                    res.status(500).json({ message: 'Error deleting playlist', error: err });
                });
        })
        .catch(err => {
            res.status(500).json({ message: 'Error finding playlist', error: err });
        });
};
