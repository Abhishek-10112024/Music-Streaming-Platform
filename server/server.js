import express from "express";
import cors from "cors";
import { configDotenv } from "dotenv";
import sequelize from "./db.js";
import User from './models/User.js';
import Song from './models/Song.js';
import Playlist from './models/Playlist.js';
import Report from './models/Report.js';
import authRoutes from "./routes/authRoutes.js";
import playlistRoutes from "./routes/playlistRoutes.js";
import songRoutes from "./routes/songRoutes.js";
import userRoutes from "./routes/userRoutes.js"; 

configDotenv();

// Set up associations
User.hasMany(Playlist, { foreignKey: 'createdBy' });
Playlist.belongsTo(User, { foreignKey: 'createdBy' });

User.hasMany(Song, { foreignKey: 'uploadedBy' });
Song.belongsTo(User, { foreignKey: 'uploadedBy' });

Playlist.belongsToMany(Song, { through: 'PlaylistSong', foreignKey: 'playlistId' });
Song.belongsToMany(Playlist, { through: 'PlaylistSong', foreignKey: 'songId' });

Report.belongsTo(Song, { foreignKey: 'songId' });
Song.hasMany(Report, { foreignKey: 'songId' });

Report.belongsTo(User, { foreignKey: 'reportedBy' });
User.hasMany(Report, { foreignKey: 'reportedBy' });

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true,
}));

app.use('/api/auth', authRoutes);
app.use('/api/songs', songRoutes);
app.use('/api/playlists', playlistRoutes);
app.use('/api/users', userRoutes); 

const port = process.env.PORT || 5000;

sequelize.sync({ alter: false })
    .then(() => {
        console.log('Database synchronized successfully.');
        app.listen(port, () => {
            console.log(`Server running at http://localhost:${port}`);
        });
    })
    .catch((err) => {
        console.error('Failed to sync database:', err);
    });
