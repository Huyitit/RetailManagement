const { Sequelize } = require('sequelize');
const sequelize = new Sequelize('Cuahangbanle', 'sa', '123456', {
  host: 'localhost',
  dialect: 'mssql',
  port: 1433,
  dialectOptions: {
    options: {
      encrypt: false,
      trustServerCertificate: true,
      useUTC: false,
      dateFirst: 1
    }
  },
  logging: false

});

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Kết nối SQL Server thành công (Cửa hàng bán lẻ)!');
  } catch (error) {
    console.error('❌ Lỗi kết nối Database:', error.message);
  }
};

connectDB();

module.exports = sequelize;