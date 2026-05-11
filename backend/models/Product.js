const { DataTypes } = require('sequelize');
const sequelize = require('../configs/db');
const Category = require('./Category');
const Product = sequelize.define('Product', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  categoryId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  productName: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  brand: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  description: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  status: {
    type: DataTypes.STRING(255),
    defaultValue: 'Active'
  },
  warrantyPeriod: {
    type: DataTypes.INTEGER,
    defaultValue: 12
  },
  taxRate: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: false,
    defaultValue: 0
  },
  isDeleted: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  }
}, {
  tableName: 'product',
  timestamps: true
});

module.exports = Product;

