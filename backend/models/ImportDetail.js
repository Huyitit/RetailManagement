const { DataTypes } = require('sequelize');
const sequelize = require('../configs/db');
const ImportOrder = require('./ImportOrder');
const Variant = require('./Variant');

const ImportDetail = sequelize.define('ImportDetail', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  importReceiptId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  variantId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  supplierId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  importPrice: {
    type: DataTypes.DECIMAL(19, 3),
    allowNull: false
  },
  lineTotal: {
    type: DataTypes.DECIMAL(19, 3),
    allowNull: false
  },
  batchNumber: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  expiryDate: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  tableName: 'importDetail',
  timestamps: false
});

module.exports = ImportDetail;