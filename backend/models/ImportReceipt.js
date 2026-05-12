const { DataTypes } = require('sequelize');
const sequelize = require('../configs/db');

const ImportReceipt = sequelize.define('ImportReceipt', {
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
    allowNull: false
  },
  note: {
    type: DataTypes.STRING(255),
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

module.exports = ImportReceipt;
