import { DataTypes } from 'sequelize';
import sequelize from '../db.js'; 

const Song = sequelize.define('Song', {
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  artist: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  album: {
    type: DataTypes.STRING,
  },
  duration: {
    type: DataTypes.INTEGER, // Duration in seconds
    allowNull: false,
  },
  genre: {
    type: DataTypes.STRING,
  },
  mp3_file_path: {
    type: DataTypes.STRING, // Store the path to the MP3 file
    allowNull: false, 
  },
  isRestricted: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  deleted: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    allowNull: false,
  }
}, {
  timestamps: true,
});

export default Song;
