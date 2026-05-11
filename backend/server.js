const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
require('dotenv').config();
const sequelize = require('./configs/db');
const models = require('./models');

const app = express();

const ERROR_LOG_PATH = path.join(__dirname, 'system_error.log');

process.on('uncaughtException', (err) => {
  const log = `[${new Date().toISOString()}] UNCAUGHT EXCEPTION: ${err.stack}\n`;
  fs.appendFileSync(ERROR_LOG_PATH, log);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  const log = `[${new Date().toISOString()}] UNHANDLED REJECTION: ${reason}\n`;
  fs.appendFileSync(ERROR_LOG_PATH, log);
});

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use((err, req, res, next) => {
  const log = `[${new Date().toISOString()}] EXPRESS ERROR: ${err.stack}\n`;
  fs.appendFileSync(ERROR_LOG_PATH, log);
  res.status(500).json({ status: 'error', message: err.message });
});

app.use('/api/v1/categories', require('./routes/categoryRoutes'));
app.use('/api/v1/products', require('./routes/productRoutes'));
app.use('/api/v1/customers', require('./routes/customerRoutes'));
app.use('/api/v1/orders', require('./routes/orderRoutes'));
app.use('/api/v1/auth', require('./routes/authRoutes'));

const PORT = process.env.PORT || 5001;

sequelize.authenticate()
  .then(async () => {
    console.log('✅ Connected to MySQL');
  })
  .then(() => {
    return sequelize.sync({ alter: false });
  })
  .then(() => {
    app.listen(PORT, () => {
      console.log(`🚀 Server on ${PORT}`);
    });
  })
  .catch(err => {
    fs.appendFileSync(ERROR_LOG_PATH, `BOOT ERROR: ${err.stack}\n`);
    console.error('Boot Error:', err);
  });

