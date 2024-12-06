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
  filePath: {
    type: DataTypes.STRING, // File path or URL for the song file
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
