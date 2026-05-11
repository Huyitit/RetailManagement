const { DataTypes } = require('sequelize');
const sequelize = require('../configs/db');

const Promotion = sequelize.define('Promotion', {
  promotionId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  promotionName: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  discountPercent: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: true,
    validate: {
      min: 0,
      max: 100
    }
  },
  startDate: {
    type: DataTypes.DATE,
    allowNull: true,
    defaultValue: null
  },
  endDate: {
    type: DataTypes.DATE,
    allowNull: true,
    defaultValue: null
  },
  usageCount: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
    validate: {
      min: 0
    }
  }
}, {
  tableName: 'Promotion',
  timestamps: false,
  validate: {
    dateCheck() {
      if (this.endDate && this.startDate && this.endDate < this.startDate) {
        throw new Error('End date must be after start date');
      }
    }
  }
});

module.exports = Promotion;