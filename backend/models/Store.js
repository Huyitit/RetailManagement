const { DataTypes } = require('sequelize');
const sequelize = require('../configs/db');

const Store = sequelize.define('Store', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  phone: {
    type: DataTypes.STRING(15),
    allowNull: false
  },
  email: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  address: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  taxCode: {
    type: DataTypes.STRING(255),
    unique: true
  },
  isDeleted: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  }
}, {
  tableName: 'store',
  timestamps: true
});

module.exports = Store;
