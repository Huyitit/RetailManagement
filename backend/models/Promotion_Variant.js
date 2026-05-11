const { DataTypes } = require('sequelize');
const sequelize = require('../configs/db');
const Promotion = require('./Promotion');
const Variant = require('./Variant');

const Promotion_Variant = sequelize.define('Promotion_Variant', {
  promotionId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    references: {
      model: Promotion,
      key: 'promotionId'
    }
  },
  variantId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    references: {
      model: Variant,
      key: 'variantId'
    }
  },
  appliedAt: {
    type: DataTypes.DATE,
    allowNull: true,
    defaultValue: null
  }
}, {
  tableName: 'Promotion_Variant',
  timestamps: false
});

Promotion_Variant.belongsTo(Promotion, { foreignKey: 'promotionId' });
Promotion_Variant.belongsTo(Variant, { foreignKey: 'variantId' });

module.exports = Promotion_Variant;