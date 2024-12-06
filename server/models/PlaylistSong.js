import sequelize from '../db.js'; 

const PlaylistSong = sequelize.define('PlaylistSong', {
}, {
  timestamps: true,
});

export default PlaylistSong;
