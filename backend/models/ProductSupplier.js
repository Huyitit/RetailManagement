const { DataTypes } = require('sequelize');
const sequelize = require('../configs/db');

const ProductSupplier = sequelize.define('ProductSupplier', {
  productId: {
    type: DataTypes.INTEGER,
    primaryKey: true
  },
  supplierId: {
    type: DataTypes.INTEGER,
    primaryKey: true
  }
}, {
  tableName: 'productSupplier',
  timestamps: false
});

module.exports = ProductSupplier;
