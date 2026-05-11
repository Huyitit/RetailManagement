const { DataTypes } = require('sequelize');
const sequelize = require('../configs/db');
const SaleOrder = require('./SaleOrder');
const Variant = require('./Variant');

const SaleDetail = sequelize.define('SaleDetail', {
  saleDetailId: {
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
  variantId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Variant,
      key: 'variantId'
    }
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1
    }
  },
  unitPrice: {
    type: DataTypes.DECIMAL(18, 2),
    allowNull: false
  },
  discountAmount: {
    type: DataTypes.DECIMAL(18, 2),
    allowNull: false,
    defaultValue: 0
  },
  finalPrice: {
    type: DataTypes.DECIMAL(18, 2),
    allowNull: false
  },
  returnedQuantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
    validate: {
      min: 0
    }
  }
}, {
  tableName: 'SaleDetail',
  timestamps: false
});

SaleDetail.belongsTo(SaleOrder, { foreignKey: 'receiptId' });
SaleDetail.belongsTo(Variant, { foreignKey: 'variantId' });

module.exports = SaleDetail;