const { DataTypes } = require('sequelize');
const sequelize = require('../configs/db');

const PromotionVariant = sequelize.define('PromotionVariant', {
  promotionId: {
    type: DataTypes.INTEGER,
    primaryKey: true
  },
  variantId: {
    type: DataTypes.INTEGER,
    primaryKey: true
  },
  appliedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'promotion_variant',
  timestamps: false
});

module.exports = PromotionVariant;
