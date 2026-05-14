const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Staff, sequelize } = require('../models');
const { Op } = require('sequelize');

const JWT_SECRET = process.env.JWT_SECRET || 'architect_pos_secret_key_2024';

exports.register = async (req, res) => {
  try {
    const { fullName, username, phone, password } = req.body;

    const existingStaff = await Staff.findOne({ 
      where: { 
        [Op.or]: [{ username }, { phone }]
      } 
    });
    
    if (existingStaff) {
      return res.status(400).json({ status: 'error', message: 'Tên đăng nhập hoặc số điện thoại đã tồn tại' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const staff = await Staff.create({
      storeId: 1, 
      username,
      hashedPassword,
      fullname: fullName,
      phone,
      email: '',
      role: 'Staff'
    });

    res.status(201).json({
      status: 'success',
      message: 'Đăng ký tài khoản thành công',
      data: {
        id: staff.id,
        username: staff.username,
        fullname: staff.fullname
      }
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ status: 'error', message: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    const staff = await Staff.findOne({
      where: {
        [Op.or]: [
          { username: username },
          { phone: username }
        ]
      }
    });

    if (!staff) {
      return res.status(401).json({ status: 'error', message: 'Chỉ nhân viên mới có thể đăng nhập' });
    }

    const isMatch = await bcrypt.compare(password, staff.hashedPassword);
    if (!isMatch) {
      return res.status(401).json({ status: 'error', message: 'Tên đăng nhập/Số điện thoại hoặc mật khẩu không chính xác' });
    }

    const token = jwt.sign(
      { staffId: staff.id, username: staff.username, role: staff.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      status: 'success',
      message: 'Đăng nhập thành công',
      data: {
        token,
        staff: {
          id: staff.id,
          username: staff.username,
          fullname: staff.fullname,
          role: staff.role
        }
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ status: 'error', message: error.message });
  }
};

exports.getMe = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ status: 'error', message: 'Unauthorized' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET);

    const staff = await Staff.findByPk(decoded.staffId);

    if (!staff) {
      return res.status(404).json({ status: 'error', message: 'User not found' });
    }

    res.json({
      status: 'success',
      data: {
        id: staff.id,
        username: staff.username,
        fullname: staff.fullname,
        role: staff.role
      }
    });
  } catch (error) {
    res.status(401).json({ status: 'error', message: 'Invalid token' });
  }
};

