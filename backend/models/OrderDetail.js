const { DataTypes } = require('sequelize');
const sequelize = require('../configs/db');

const OrderDetail = sequelize.define('OrderDetail', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  orderId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  variantId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  serialCode: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1
  },
  unitPrice: {
    type: DataTypes.DECIMAL(19, 3),
    allowNull: false
  },
  totalDiscount: {
    type: DataTypes.DECIMAL(19, 3),
    allowNull: true
  },
  lineTotal: {
    type: DataTypes.DECIMAL(19, 3),
    allowNull: false
  },
  returnedQuantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  }
}, {
  tableName: 'orderdetail',
  timestamps: false
});

module.exports = OrderDetail;
