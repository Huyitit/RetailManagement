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
  receiptId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: SaleOrder,
      key: 'receiptId'
    }
  },
  staffId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: Staff,
      key: 'staffId'
    }
  },
  reason: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  warrantyItems: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  warrantyType: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  refundAmount: {
    type: DataTypes.DECIMAL(18, 2),
    allowNull: true
  },
  paymentMethod: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'WarrantyLog',
  timestamps: false
});

WarrantyLog.belongsTo(SaleOrder, { foreignKey: 'receiptId' });
WarrantyLog.belongsTo(Staff, { foreignKey: 'staffId' });

module.exports = WarrantyLog;
