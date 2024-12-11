import Song from '../models/Song.js';
import fs from 'fs';
import multer from 'multer';

// anyone can upload a song (user or admin) using multer

// stream a song
// play, pause, next, previous song

// create a reported songs list
// report a song as offensive with reason and add it to reported songs list
// get the list of reported songs and accept or reject them as offensive (admin access)

// delete any song (admin access)
// delete his own uploaded songs (logged in user only)

// get list of all the non-deleted and non-reported songs
// get list of non-deleted and non-reported songs uploaded by logged in user
// get list of non-deleted and non-reported songs uploaded by a user using user ID (admin access)
// search a song by title, artist, album or genre


// Setup storage with disk storage for Multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Folder where the files will be stored
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    },
});

const upload = multer({ storage: storage });

// Add a new song
export const addSong = upload.single('mp3_file'); // Multer upload middleware

export const saveSong = async (req, res) => {
    try {
        const { title, artist, album, duration, genre, isRestricted } = req.body;
        const mp3File = fs.readFileSync(req.file.path);  // Reading the file data

        const newSong = await Song.create({
            title,
            artist,
            album,
            duration,
            genre,
            mp3_data: mp3File, // Saving the binary MP3 data to the database
            isRestricted: isRestricted || false,
        });

        res.status(201).json({ message: 'Song uploaded successfully', song: newSong });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Error saving song' });
    }
};

// Get all songs
export const getAllSongs = async (req, res) => {
    try {
        const songs = await Song.findAll({
            where: { deleted: false },  // Ensure only non-deleted songs are fetched
        });
        res.status(200).json(songs);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Error fetching songs' });
    }
};

// Report a song
export const reportSong = async (req, res) => {
    try {
        const { songId, reason } = req.body;
        const song = await Song.findByPk(songId);

        if (!song) {
            return res.status(404).json({ message: 'Song not found' });
        }

        const report = await Report.create({
            songId,
            reason,
            status: 'pending',
        });

        song.isRestricted = true;  // Mark the song as restricted until reviewed
        await song.save();

        res.status(200).json({ message: 'Song reported and restricted', report });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Error reporting song' });
    }
};

// Like a song
export const likeSong = async (req, res) => {
    try {
        const { songId, userId } = req.body;
        const song = await Song.findByPk(songId);
        const user = await User.findByPk(userId);

        if (!song || !user) {
            return res.status(404).json({ message: 'Song or User not found' });
        }

        const existingLike = await Like.findOne({ where: { songId, userId } });
        if (existingLike) {
            return res.status(400).json({ message: 'You already liked this song' });
        }

        await Like.create({ songId, userId });
        res.status(200).json({ message: 'Song liked successfully' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Error liking song' });
    }
};
