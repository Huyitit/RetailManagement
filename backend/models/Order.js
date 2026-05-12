const { DataTypes } = require('sequelize');
const sequelize = require('../configs/db');

const Order = sequelize.define('Order', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  customerId: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  staffId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  subTotal: {
    type: DataTypes.DECIMAL(19, 3),
    allowNull: true
  },
  discountAmount: {
    type: DataTypes.DECIMAL(19, 3),
    allowNull: true
  },
  taxAmount: {
    type: DataTypes.DECIMAL(19, 3),
    allowNull: true
  },
  finalTotal: {
    type: DataTypes.DECIMAL(19, 3),
    allowNull: true
  },
  paymentMethod: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  refundAmount: {
    type: DataTypes.DECIMAL(19, 3),
    defaultValue: 0
  },
  paymentReference: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  status: {
    type: DataTypes.ENUM('Draft', 'Completed', 'Cancelled', 'Warranty'),
    defaultValue: 'Draft'
  },
  isDeleted: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  }
}, {
  tableName: 'order',
  timestamps: true
});

module.exports = Order;
