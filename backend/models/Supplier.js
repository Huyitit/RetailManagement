const { DataTypes } = require('sequelize');
const sequelize = require('../configs/db');
const Profile = require('./Profile');

const Supplier = sequelize.define('Supplier', {
  supplierId: {
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
  contactInfo: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  tableName: 'Supplier',
  timestamps: false
});

Supplier.belongsTo(Profile, { foreignKey: 'profileId' });

module.exports = Supplier;