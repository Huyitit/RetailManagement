const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('storemanagement', 'root', '1812', {
  host: 'localhost',
  dialect: 'mysql',
  port: 3306,
  logging: false,
  define: {
    timestamps: true
  }
});

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Kết nối MySQL thành công (StoreManagement)!');
  } catch (error) {
    console.error('❌ Lỗi kết nối Database:', error.message);
  }
};

connectDB();

module.exports = sequelize;
