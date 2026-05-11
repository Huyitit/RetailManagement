const { DataTypes } = require('sequelize');
const sequelize = require('../configs/db');
const Variant = require('./Variant');
const Attribute = require('./Attribute');

const Variant_Attribute_Value = sequelize.define('Variant_Attribute_Value', {
  variantId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    references: {
      model: Variant,
      key: 'variantId'
    }
  },
  attributeId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    references: {
      model: Attribute,
      key: 'attributeId'
    }
  },
  value: {
    type: DataTypes.STRING(255),
    allowNull: false
  }
}, {
  tableName: 'Variant_Attribute_Value',
  timestamps: false
});

Variant_Attribute_Value.belongsTo(Variant, { foreignKey: 'variantId' });
Variant_Attribute_Value.belongsTo(Attribute, { foreignKey: 'attributeId' });

module.exports = Variant_Attribute_Value;
