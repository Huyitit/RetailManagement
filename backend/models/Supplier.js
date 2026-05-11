const { DataTypes } = require('sequelize');
const sequelize = require('../configs/db');


const Supplier = sequelize.define('Supplier', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  companyName: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  contactName: {
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
  address: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  taxCode: {
    type: DataTypes.STRING(255),
    allowNull: true,
    unique: true
  },
  isDeleted: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  }
}, {
  tableName: 'supplier',
  timestamps: true
});

module.exports = Supplier;