const { DataTypes } = require('sequelize');
const sequelize = require('../configs/db');
const Profile = require('./Profile');

const Staff = sequelize.define('Staff', {
  staffId: {
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
  username: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true
  },
  password: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  status: {
    type: DataTypes.STRING(20),
    allowNull: false,
    defaultValue: 'Active'
  }
}, {
  tableName: 'Staff',
  timestamps: false
});

Staff.belongsTo(Profile, { foreignKey: 'profileId' });

module.exports = Staff;