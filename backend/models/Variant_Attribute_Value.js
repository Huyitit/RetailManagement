const { DataTypes } = require('sequelize');
const sequelize = require('../configs/db');
const Variant = require('./Variant');
const Attribute = require('./Attribute');

const Variant_Attribute_Value = sequelize.define('Variant_Attribute_Value', {
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

module.exports = Variant_Attribute_Value;

