const { DataTypes } = require('sequelize');
const sequelize = require('../configs/db');

const Category = sequelize.define('Category', {
  categoryId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  categoryName: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  categoryDescription: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  tableName: 'Category',
  timestamps: false
});

module.exports = Category;
