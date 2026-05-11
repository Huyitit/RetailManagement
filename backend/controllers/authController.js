const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Staff, Profile, sequelize } = require('../models');

const JWT_SECRET = process.env.JWT_SECRET || 'architect_pos_secret_key_2024';

exports.register = async (req, res) => {
  let transaction;
  try {
    const { fullName, username, phone, password } = req.body;

    const existingStaff = await Staff.findOne({ where: { username } });
    if (existingStaff) {
      return res.status(400).json({ status: 'error', message: 'Tên đăng nhập đã tồn tại' });
    }

    const existingPhone = await Profile.findOne({ where: { phoneNumber: phone } });
    if (existingPhone) {
      return res.status(400).json({ status: 'error', message: 'Số điện thoại này đã được đăng ký cho một tài khoản khác' });
    }

    transaction = await sequelize.transaction();

    const profile = await Profile.create({
      fullName,
      phoneNumber: phone,
      role: 'Staff'
    }, { transaction });

    const hashedPassword = await bcrypt.hash(password, 10);

    const staff = await Staff.create({
      profileId: profile.profileId,
      username,
      password: hashedPassword,
      status: 'Active'
    }, { transaction });

    await transaction.commit();

    res.status(201).json({
      status: 'success',
      message: 'Đăng ký tài khoản thành công',
      data: {
        staffId: staff.staffId,
        username: staff.username,
        fullName: profile.fullName
      }
    });
  } catch (error) {
    if (transaction) await transaction.rollback();
    console.error('Register error:', error);
    res.status(500).json({ status: 'error', message: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    const staff = await Staff.findOne({
      include: [{
        model: Profile,
        where: sequelize.literal(`([Staff].[username] = N'${username}' OR [Profile].[phoneNumber] = N'${username}')`)
      }]
    });

    if (!staff) {
      return res.status(401).json({ status: 'error', message: 'Tên đăng nhập/Số điện thoại hoặc mật khẩu không chính xác' });
    }

    const isMatch = await bcrypt.compare(password, staff.password);
    if (!isMatch) {
      return res.status(401).json({ status: 'error', message: 'Tên đăng nhập/Số điện thoại hoặc mật khẩu không chính xác' });
    }

    const token = jwt.sign(
      { staffId: staff.staffId, username: staff.username, role: staff.Profile.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      status: 'success',
      message: 'Đăng nhập thành công',
      data: {
        token,
        staff: {
          staffId: staff.staffId,
          username: staff.username,
          fullName: staff.Profile.fullName,
          role: staff.Profile.role
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

    const staff = await Staff.findByPk(decoded.staffId, {
      include: [{ model: Profile }]
    });

    if (!staff) {
      return res.status(404).json({ status: 'error', message: 'User not found' });
    }

    res.json({
      status: 'success',
      data: {
        staffId: staff.staffId,
        username: staff.username,
        fullName: staff.Profile.fullName,
        role: staff.Profile.role
      }
    });
  } catch (error) {
    res.status(401).json({ status: 'error', message: 'Invalid token' });
  }
};
