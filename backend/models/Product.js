const { DataTypes } = require('sequelize');
const sequelize = require('../configs/db');
const Category = require('./Category');
const Product = sequelize.define('Product', {
  productId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  categoryId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Category,
      key: 'categoryId'
    }
  },
  productName: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  productDescription: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  taxRate: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: false,
    defaultValue: 0
  },
  warrantyPeriod: {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: 12
  }
}, {
  tableName: 'Product',
  timestamps: false
});

Product.belongsTo(Category, { foreignKey: 'categoryId' });

module.exports = Product;
