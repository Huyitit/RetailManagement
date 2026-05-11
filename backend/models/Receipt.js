const { DataTypes } = require('sequelize');
const sequelize = require('../configs/db');
const Staff = require('./Staff');

const Receipt = sequelize.define('Receipt', {
  receiptId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  staffId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Staff,
      key: 'staffId'
    }
  },
  totalPrice: {
    type: DataTypes.DECIMAL(18, 2),
    allowNull: false,
    defaultValue: 0
  },
  orderAt: {
    type: DataTypes.DATE,
    allowNull: true,
    defaultValue: null
  },
  type: {
    type: DataTypes.STRING(10),
    allowNull: false,
    validate: {
      isIn: [['SALE', 'IMPORT']]
    }
  }
}, {
  tableName: 'Receipt',
  timestamps: false
});

Receipt.belongsTo(Staff, { foreignKey: 'staffId' });

module.exports = Receipt;