const { DataTypes } = require('sequelize');
const sequelize = require('../configs/db');
const Product = require('./Product');

const Variant = sequelize.define('Variant', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  productId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  skuCode: {
    type: DataTypes.STRING(255),
    allowNull: true,
    unique: true
  },
  sellPrice: {
    type: DataTypes.DECIMAL(19, 3),
    allowNull: false
  },
  importPrice: {
    type: DataTypes.DECIMAL(19, 3),
    allowNull: true
  },
  stockQuantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
  discount: {
    type: DataTypes.DECIMAL(19, 2),
    allowNull: false,
    defaultValue: 0
  },
  imageUrl: {
    type: DataTypes.STRING(2083),
    allowNull: true
  },
  minStock: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 5
  },
  isDeleted: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  }
}, {
  tableName: 'variant',
  timestamps: true
});

module.exports = Variant;

