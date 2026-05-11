const { DataTypes } = require('sequelize');
const sequelize = require('../configs/db');
const Profile = require('./Profile');

const Customer = sequelize.define('Customer', {
  customerId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  profileId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    unique: true,
    references: {
      model: Profile,
      key: 'profileId'
    }
  },
  rewardPoints: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
    validate: {
      min: 0
    }
  },
  memberTier: {
    type: DataTypes.STRING(50),
    allowNull: false,
    defaultValue: 'Bronze'
  },
  customerAddress: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  tableName: 'Customer',
  timestamps: false
});

Customer.belongsTo(Profile, { foreignKey: 'profileId' });

module.exports = Customer;
