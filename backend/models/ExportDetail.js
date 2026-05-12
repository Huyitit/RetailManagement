const { DataTypes } = require('sequelize');
const sequelize = require('../configs/db');

const ExportDetail = sequelize.define('ExportDetail', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  exportReceiptId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  variantId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
  errorNote: {
    type: DataTypes.STRING(255),
    allowNull: true
  }
}, {
  tableName: 'exportdetail',
  timestamps: false
});

module.exports = ExportDetail;
