import { DataTypes } from 'sequelize';
import sequelize from '../db.js'; 

const Like = sequelize.define('Like', {
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  timestamps: true,
});

export default Like;
