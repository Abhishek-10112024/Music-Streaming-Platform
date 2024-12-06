import { DataTypes } from 'sequelize';
import sequelize from '../db.js'; 

const Report = sequelize.define('Report', {
  reason: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM('pending', 'rejected', 'accepted'),
    defaultValue: 'pending',
  },
}, {
  timestamps: true,
});

export default Report;
