const { DataTypes } = require('sequelize');
const sequelize = require('../configs/db');

const ExportReceipt = sequelize.define('ExportReceipt', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  supplierId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  exportDate: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  reason: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  totalAmount: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  isDeleted: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  }
}, {
  tableName: 'exportReceipt',
  timestamps: true
});

module.exports = ExportReceipt;
