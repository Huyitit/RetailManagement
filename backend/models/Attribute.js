const { DataTypes } = require('sequelize');
const sequelize = require('../configs/db');

const Attribute = sequelize.define('Attribute', {
  attributeId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  attributeName: {
    type: DataTypes.STRING(100),
    allowNull: false
  }
}, {
  tableName: 'Attribute',
  timestamps: false
});

module.exports = Attribute;
