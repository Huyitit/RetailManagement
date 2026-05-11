const { DataTypes } = require('sequelize');
const sequelize = require('../configs/db');
const Supplier = require('./Supplier');

const ImportOrder = sequelize.define('ImportOrder', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  supplierId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  importDate: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  totalAmount: {
    type: DataTypes.DECIMAL(19, 3),
    allowNull: true
  },
  note: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  isDeleted: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  }
}, {
  tableName: 'importReceipt',
  timestamps: true
});

module.exports = ImportOrder;