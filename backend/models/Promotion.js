const { DataTypes } = require('sequelize');
const sequelize = require('../configs/db');

const Promotion = sequelize.define('Promotion', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    field: 'promotionId'
  },
  promotionName: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  discountPercent: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: true
  },
  startDate: {
    type: DataTypes.DATE,
    allowNull: true
  },
  endDate: {
    type: DataTypes.DATE,
    allowNull: true
  },
  usageCount: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
  isDeleted: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  }
}, {
  tableName: 'promotion',
  timestamps: true
});


module.exports = Promotion;