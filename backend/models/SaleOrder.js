const { DataTypes } = require('sequelize');
const sequelize = require('../configs/db');
const Receipt = require('./Receipt');
const Customer = require('./Customer');

const SaleOrder = sequelize.define('SaleOrder', {
  receiptId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    references: {
      model: Receipt,
      key: 'receiptId'
    }
  },
  customerId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: Customer,
      key: 'customerId'
    }
  },
  paymentMethod: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  saleStatus: {
    type: DataTypes.STRING(20),
    allowNull: false,
    defaultValue: 'Draft'
  },
  refundAmount: {
    type: DataTypes.DECIMAL(18, 2),
    allowNull: true,
    defaultValue: 0
  },
  amountReceived: {
    type: DataTypes.DECIMAL(18, 2),
    allowNull: true
  },
  amountChange: {
    type: DataTypes.DECIMAL(18, 2),
    allowNull: true
  },
  paymentReference: {
    type: DataTypes.STRING(100),
    allowNull: true
  }
}, {
  tableName: 'SaleOrder',
  timestamps: false
});

SaleOrder.belongsTo(Receipt, { foreignKey: 'receiptId' });
SaleOrder.belongsTo(Customer, { foreignKey: 'customerId' });

module.exports = SaleOrder;