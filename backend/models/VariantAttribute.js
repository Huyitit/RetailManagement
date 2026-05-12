const { DataTypes } = require('sequelize');
const sequelize = require('../configs/db');

const VariantAttribute = sequelize.define('VariantAttribute', {
  variantId: {
    type: DataTypes.INTEGER,
    primaryKey: true
  },
  attributeId: {
    type: DataTypes.INTEGER,
    primaryKey: true
  },
  value: {
    type: DataTypes.STRING(255),
    allowNull: false
  }
}, {
  tableName: 'variantAttribute',
  timestamps: false
});

module.exports = VariantAttribute;
