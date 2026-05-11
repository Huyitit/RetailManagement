const { DataTypes } = require('sequelize');
const sequelize = require('../configs/db');
const Promotion = require('./Promotion');
const Variant = require('./Variant');

const Promotion_Variant = sequelize.define('Promotion_Variant', {
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

module.exports = Promotion_Variant;