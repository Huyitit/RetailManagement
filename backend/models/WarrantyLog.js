const { DataTypes } = require('sequelize');
const sequelize = require('../configs/db');
const SaleOrder = require('./SaleOrder');
const Staff = require('./Staff');

const WarrantyLog = sequelize.define('WarrantyLog', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  orderDetailId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  staffId: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  claimDate: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  issueDescription: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  resolutionType: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  status: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  refundAmount: {
    type: DataTypes.DECIMAL(18, 2),
    allowNull: true
  },
  paymentMethod: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  warrantyType: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  isDeleted: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  }
}, {
  tableName: 'warranty',
  timestamps: true
});

module.exports = WarrantyLog;

