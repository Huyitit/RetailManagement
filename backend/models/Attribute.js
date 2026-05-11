const { DataTypes } = require('sequelize');
const sequelize = require('../configs/db');

const Attribute = sequelize.define('Attribute', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING(255),
    allowNull: false
  }
}, {
  tableName: 'attribute',
  timestamps: false
});


module.exports = Attribute;
