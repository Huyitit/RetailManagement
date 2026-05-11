const { DataTypes } = require('sequelize');
const sequelize = require('../configs/db');


const Staff = sequelize.define('Staff', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  storeId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  username: {
    type: DataTypes.STRING(255),
    allowNull: false,
    unique: true
  },
  hashedPassword: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  fullname: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  phone: {
    type: DataTypes.STRING(15),
    allowNull: false
  },
  email: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  role: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  isDeleted: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  }
}, {
  tableName: 'staff',
  timestamps: true
});

module.exports = Staff;