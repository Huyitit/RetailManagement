const { DataTypes } = require('sequelize');
const sequelize = require('../configs/db');
const Product = require('./Product');

const Variant = sequelize.define('Variant', {
  variantId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  productId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Product,
      key: 'productId'
    }
  },
  SKU: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true
  },
  costPrice: {
    type: DataTypes.DECIMAL(18, 2),
    allowNull: false
  },
  sellPrice: {
    type: DataTypes.DECIMAL(18, 2),
    allowNull: false
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
  imageUrl: {
    type: DataTypes.STRING,
    allowNull: true
  },
  minStock: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 5
  }
}, {
  tableName: 'Variant',
  timestamps: false
});

Variant.belongsTo(Product, { foreignKey: 'productId' });

module.exports = Variant;
