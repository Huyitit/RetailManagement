const { DataTypes } = require('sequelize');
const sequelize = require('../configs/db');
const Receipt = require('./Receipt');
const Supplier = require('./Supplier');

const ImportOrder = sequelize.define('ImportOrder', {
  receiptId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    references: {
      model: Receipt,
      key: 'receiptId'
    }
  },
  supplierId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Supplier,
      key: 'supplierId'
    }
  },
  importStatus: {
    type: DataTypes.STRING(50),
    allowNull: false,
    defaultValue: 'Completed'
  }
}, {
  tableName: 'ImportOrder',
  timestamps: false
});

ImportOrder.belongsTo(Receipt, { foreignKey: 'receiptId' });
ImportOrder.belongsTo(Supplier, { foreignKey: 'supplierId' });

module.exports = ImportOrder;