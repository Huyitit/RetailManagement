const { DataTypes } = require('sequelize');
const sequelize = require('../configs/db');

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
    allowNull: false,
    defaultValue: 0
  },
  importPrice: {
    type: DataTypes.DECIMAL(19, 3),
    allowNull: true
  },
  lineTotal: {
    type: DataTypes.DECIMAL(19, 3),
    allowNull: true
  },
  batchNumber: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  expiryDate: {
    type: DataTypes.DATEONLY,
    allowNull: true
  }
}, {
  tableName: 'importdetail',
  timestamps: false
});

module.exports = ImportDetail;