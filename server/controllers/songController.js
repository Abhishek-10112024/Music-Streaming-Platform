import Song from '../models/Song.js';
import Report from '../models/Report.js';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Set up multer for song upload
// Multer Storage Configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      const uploadPath = 'uploads/songs';
      
      // Create the directory if it doesn't exist
      if (!fs.existsSync(uploadPath)) {
        fs.mkdirSync(uploadPath, { recursive: true });
      }
      
      cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + path.extname(file.originalname)); // Use timestamp to make filename unique
    }
  });
  
export const upload = multer({ storage });
  
  // Refactor using async/await for better readability
  export const uploadSong = async (req, res) => {
    try {
      const { title, artist, album, genre, duration } = req.body;
      const file = req.file; // Multer attaches the file to `req.file`
  
      if (!file) {
        return res.status(400).json({ message: 'No song file uploaded.' });
      }
  
      // Check if the song already exists in the database
      const existingSong = await Song.findOne({ where: { title, artist, album, deleted: false } });
  
      if (existingSong) {
        return res.status(409).json({ message: 'This song already exists in the database.' });
      }
  
      // Proceed with uploading the new song if not existing
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

// Stream a song (returning song data in chunks)
export const streamSong = (req, res) => {
    const { songId } = req.params;

    Song.findByPk(songId)
        .then(song => {
            if (!song || song.deleted) return res.status(404).json({ message: 'Song not found.' });
            // Get the path to the MP3 file and stream it
            const songFilePath = song.mp3_file_path;

            // Check if file exists
            fs.exists(songFilePath, (exists) => {
                if (!exists) return res.status(404).json({ message: 'File not found on server.' });

                res.setHeader('Content-Type', 'audio/mpeg');
                const stream = fs.createReadStream(songFilePath);
                stream.pipe(res);
            });
        })
        .catch(err => {
            res.status(500).json({ message: 'Error streaming song', error: err });
        });
};

// Report a song
export const reportSong = (req, res) => {
    const { songId, reason } = req.body;

    Song.findByPk(songId)
        .then(song => {
            if (!song || song.deleted) return res.status(404).json({ message: 'Song not found.' });

            const report = new Report({
                reason,
                songId: song.id,
                reportedBy: req.user.id,
            });

            report.save()
                .then(() => {
                    song.addReport(report);
                    res.status(201).json({ message: 'Song reported successfully' });
                })
                .catch(err => {
                    res.status(500).json({ message: 'Error reporting song', error: err });
                });
        })
        .catch(err => {
            res.status(500).json({ message: 'Error reporting song', error: err });
        });
};

// Get list of reported songs (admin only)
export const getReportedSongs = (req, res) => {
    if (req.user.role !== 'admin') return res.status(403).json({ message: 'Access denied' });

    Report.findAll({ include: Song })
        .then(reports => {
            res.status(200).json({ reports });
        })
        .catch(err => {
            res.status(500).json({ message: 'Error retrieving reports', error: err });
        });
};

// Accept or reject a report (admin only)
export const resolveReport = (req, res) => {
    if (req.user.role !== 'admin') return res.status(403).json({ message: 'Access denied' });

    const { reportId, status } = req.body;

    if (!['pending', 'rejected', 'accepted'].includes(status)) {
        return res.status(400).json({ message: 'Invalid status' });
    }

    Report.findByPk(reportId)
        .then(report => {
            if (!report) return res.status(404).json({ message: 'Report not found' });

            report.update({ status })
                .then(updatedReport => {
                    if (status === 'rejected') {
                        report.song.addReport({ songId: report.song.id }); // Remove from reported songs if rejected
                    }
                    res.status(200).json({ message: `Report ${status} successfully`, report: updatedReport });
                })
                .catch(err => {
                    res.status(500).json({ message: 'Error updating report', error: err });
                });
        })
        .catch(err => {
            res.status(500).json({ message: 'Error resolving report', error: err });
        });
};

// Delete a song (admin only)
export const deleteSong = (req, res) => {
    if (req.user.role !== 'admin') return res.status(403).json({ message: 'Access denied' });

    const { songId } = req.params;

    Song.findByPk(songId)
        .then(song => {
            if (!song) return res.status(404).json({ message: 'Song not found' });

            song.update({ deleted: true })
                .then(() => {
                    res.status(200).json({ message: 'Song deleted successfully' });
                })
                .catch(err => {
                    res.status(500).json({ message: 'Error deleting song', error: err });
                });
        })
        .catch(err => {
            res.status(500).json({ message: 'Error deleting song', error: err });
        });
};

// Get list of all non-deleted, non-reported songs
export const getAllSongs = (req, res) => {
    Song.findAll({ where: { deleted: false }, include: { model: Report, where: { status: 'pending' }, required: false } })
        .then(songs => {
            res.status(200).json({ songs });
        })
        .catch(err => {
            res.status(500).json({ message: 'Error retrieving songs', error: err });
        });
};

// Get list of non-deleted, non-reported songs uploaded by logged in user
export const getUserSongs = (req, res) => {
    Song.findAll({ where: { uploadedBy: req.user.id, deleted: false }, include: { model: Report, where: { status: 'pending' }, required: false } })
        .then(songs => {
            res.status(200).json({ songs });
        })
        .catch(err => {
            res.status(500).json({ message: 'Error retrieving songs', error: err });
        });
};

// Search songs by title, artist, album, or genre
export const searchSongs = (req, res) => {
    const { query } = req.query;

    Song.findAll({
        where: {
            deleted: false,
            [Op.or]: [
                { title: { [Op.like]: `%${query}%` } },
                { artist: { [Op.like]: `%${query}%` } },
                { album: { [Op.like]: `%${query}%` } },
                { genre: { [Op.like]: `%${query}%` } },
            ],
        },
    })
        .then(songs => {
            res.status(200).json({ songs });
        })
        .catch(err => {
            res.status(500).json({ message: 'Error searching songs', error: err });
        });
};
