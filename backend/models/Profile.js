const { DataTypes } = require('sequelize');
const sequelize = require('../configs/db');

const Profile = sequelize.define('Profile', {
  profileId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  fullName: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  phoneNumber: {
    type: DataTypes.STRING(15),
    allowNull: true
  },
  gender: {
    type: DataTypes.STRING(10),
    allowNull: true
  },
  dateOfBirth: {
    type: DataTypes.DATE,
    allowNull: true,
    defaultValue: null
  },
  role: {
    type: DataTypes.STRING(20),
    allowNull: false,
    validate: {
      isIn: [['Owner', 'Staff', 'Customer', 'Supplier']]
    }
  }
}, {
  tableName: 'Profile',
  timestamps: false
});

module.exports = Profile;