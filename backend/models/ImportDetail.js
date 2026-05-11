const { DataTypes } = require('sequelize');
const sequelize = require('../configs/db');
const ImportOrder = require('./ImportOrder');
const Variant = require('./Variant');

const ImportDetail = sequelize.define('ImportDetail', {
  importDetailId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  receiptId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: ImportOrder,
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
  importPrice: {
    type: DataTypes.DECIMAL(18, 2),
    allowNull: false
  },
  batchNumber: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  expiryDate: {
    type: DataTypes.DATE,
    allowNull: true,
    defaultValue: null
  }
}, {
  tableName: 'ImportDetail',
  timestamps: false
});

ImportDetail.belongsTo(ImportOrder, { foreignKey: 'receiptId' });
ImportDetail.belongsTo(Variant, { foreignKey: 'variantId' });

module.exports = ImportDetail;