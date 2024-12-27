import Song from '../models/Song.js';
import Report from '../models/Report.js';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { Op } from 'sequelize';


// Multer Storage Configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = 'uploads/songs';
        
        if (!fs.existsSync(uploadPath)) { //Returns true if the path exists, false otherwise.
            fs.mkdirSync(uploadPath, { recursive: true }); //Synchronously creates a directory. 
        }
        
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

export const upload = multer({ storage }); //Returns a Multer instance that provides several methods for generating middleware that process files uploaded in multipart/form-data format.

// Upload song
export const uploadSong = async (req, res) => {
    try {
        const { title, artist, album, genre, duration } = req.body;
        const file = req.file; 
        
        if (!file) {
            return res.status(400).json({ message: 'No song file uploaded.' });
        }

        const existingSong = await Song.findOne({ where: { title, artist, album, deleted: false } });
        
        if (existingSong) {
            return res.status(409).json({ message: 'This song already exists in the database.' });
        }

        const newSong = await Song.create({
            title,
            artist,
            album,
            genre,
            duration,
            mp3_file_path: file.path,
            uploadedBy: req.user.id
        });
        
        res.status(201).json({ message: 'Song uploaded successfully', song: newSong });
        
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error uploading song', error: error.message });
    }
};


// Get list of all non-deleted, non-reported songs
export const getAllSongs = async (req, res) => {
    try {
        const songs = await Song.findAll({
            where: { deleted: false, isRestricted: false },
        });
        res.status(200).json({ songs });
    } catch (err) {
        res.status(500).json({ message: 'Error retrieving songs', error: err });
    }
};


// Stream Song
export const streamSong = async (req, res) => {
    const { songId } = req.params;

    try {
        const song = await Song.findByPk(songId);
        if (!song || song.deleted) {
            return res.status(404).json({ message: 'Song not found.' });
        }

        const songFilePath = song.mp3_file_path;

        if (!fs.existsSync(songFilePath)) {
            return res.status(404).json({ message: 'File not found on server.' });
        }

        res.setHeader('Content-Type', 'audio/mpeg'); //This sets the Content-Type header for the HTTP response to 'audio/mpeg'.
        const stream = fs.createReadStream(songFilePath); //The readable stream allows you to send the contents of the file to the client in chunks, rather than loading the entire file into memory.
        stream.pipe(res); //pipe() method sends the data from the file stream to the response, effectively sending the MP3 file to the client.
    } catch (err) {
        res.status(500).json({ message: 'Error streaming song', error: err });
    }
};

// Report a song
export const reportSong = async (req, res) => {
    const { songId } = req.params;
    const { reason } = req.body;

    try {
        const song = await Song.findByPk(songId);
        if (!song || song.deleted) {
            return res.status(404).json({ message: 'Song not found.' });
        }

        const report = await Report.create({
            reason,
            songId: song.id,
            reportedBy: req.user.id,
            status: 'pending',
        });

        song.isRestricted = true;
        await song.save();

        await song.addReport(report);
        res.status(201).json({ message: 'Song reported successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Error reporting song', error: err });
    }
};

// Get list of reported songs (admin only)
export const getReportedSongs = async (req, res) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Access denied' });
    }

    try {
        const reports = await Report.findAll({
            include: { //include: This tells Sequelize to include associated models.
                model: Song,
                where: {
                    '$Report.status$': ['accepted', 'pending'], //$Report.status$ notation refers to Sequelize’s aliasing or dot notation used to reference fields from the associated model (Report in this case). It's essentially saying, "filter the Song results based on the status of the Report"
                },
            },
        });

        res.status(200).json({ reports });
    } catch (err) {
        res.status(500).json({ message: 'Error retrieving reports', error: err });
    }
};


// Accept or reject a report (admin only)
export const resolveReport = async (req, res) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Access denied' });
    }

    const { status } = req.body;
    const {reportId} = req.params;

    if (!['pending', 'rejected', 'accepted'].includes(status)) {
        return res.status(400).json({ message: 'Invalid status' });
    }

    try {
        const report = await Report.findByPk(reportId, { include: Song });
        if (!report) {
            return res.status(404).json({ message: 'Report not found' });
        }

        const updatedReport = await report.update({ status });

        const song = report.Song;

        if (status === 'accepted') {
        }

        if (status === 'rejected') {
            song.isRestricted = false; 
            await song.save();

            await song.removeReport(report);

            await report.destroy();
        }

        res.status(200).json({ message: `Report ${status} successfully`, report: updatedReport });
    } catch (err) {
        res.status(500).json({ message: 'Error resolving report', error: err });
    }
};

// Delete a song (admin only)
export const deleteSong = async (req, res) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Access denied' });
    }

    const { songId } = req.params;

    try {
        const song = await Song.findByPk(songId);
        if (!song) {
            return res.status(404).json({ message: 'Song not found' });
        }

        await song.update({ deleted: true });
        res.status(200).json({ message: 'Song deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Error deleting song', error: err });
    }
};


// Get list of non-deleted, non-reported songs uploaded by logged-in user
export const getUserSongs = async (req, res) => {
    try {
        const songs = await Song.findAll({
            where: { uploadedBy: req.user.id, deleted: false },
            include: { model: Report, where: { status: 'pending' }, required: false },
        });
        res.status(200).json({ songs });
    } catch (err) {
        res.status(500).json({ message: 'Error retrieving songs', error: err });
    }
};

// Search songs by title, artist, album, or genre
export const searchSongs = async (req, res) => {
    const { query } = req.query;
    if (!query) {
        return res.status(400).json({ message: 'Query parameter is missing' });
    }

    try {
        const songs = await Song.findAll({
            where: {
                deleted: false,
                [Op.or]: [
                    { title: { [Op.iLike]: `%${query}%` } },
                    { artist: { [Op.iLike]: `%${query}%` } },
                    { album: { [Op.iLike]: `%${query}%` } },
                    { genre: { [Op.iLike]: `%${query}%` } },
                ],
            },
        });
        res.status(200).json({ songs });
    } catch (err) {
        console.error("Error searching songs:", err);
        res.status(500).json({ message: 'Error searching songs', error: err });
    }
};