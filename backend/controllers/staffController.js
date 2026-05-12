const bcrypt = require('bcryptjs');
const { Staff, Store, Order } = require('../models');
const { Op } = require('sequelize');

// GET /api/v1/staff — List all staff accounts
exports.getStaffList = async (req, res) => {
  try {
    const { q, role, page = 1, limit = 20 } = req.query;
    const offset = (Number(page) - 1) * Number(limit);
    const where = { isDeleted: false };

    if (q && q.trim()) {
      const search = `%${q.trim()}%`;
      where[Op.or] = [
        { fullname: { [Op.like]: search } },
        { username: { [Op.like]: search } },
        { phone: { [Op.like]: search } },
        { email: { [Op.like]: search } }
      ];
    }

    if (role && role !== 'all') {
      where.role = role;
    }

    const { rows, count } = await Staff.findAndCountAll({
      where,
      include: [{ model: Store, attributes: ['name'] }],
      attributes: { exclude: ['hashedPassword'] },
      order: [['id', 'DESC']],
      limit: Number(limit),
      offset
    });

    res.json({
      status: 'success',
      data: rows.map(s => ({
        staffId: s.id,
        username: s.username,
        fullname: s.fullname,
        phone: s.phone,
        email: s.email,
        role: s.role,
        storeName: s.Store?.name || 'N/A',
        createdAt: s.createdAt
      })),
      pagination: {
        totalItems: count,
        totalPages: Math.ceil(count / Number(limit)),
        currentPage: Number(page),
        limit: Number(limit)
      }
    });
  } catch (error) {
    console.error('Lỗi lấy danh sách nhân viên:', error);
    res.status(500).json({ status: 'error', message: error.message });
  }
};

// GET /api/v1/staff/:id — Get staff detail
exports.getStaff = async (req, res) => {
  try {
    const staff = await Staff.findOne({
      where: { id: req.params.id, isDeleted: false },
      attributes: { exclude: ['hashedPassword'] },
      include: [{ model: Store, attributes: ['name'] }]
    });

    if (!staff) {
      return res.status(404).json({ status: 'error', message: 'Không tìm thấy nhân viên' });
    }

    res.json({
      status: 'success',
      data: {
        staffId: staff.id,
        username: staff.username,
        fullname: staff.fullname,
        phone: staff.phone,
        email: staff.email,
        role: staff.role,
        storeId: staff.storeId,
        storeName: staff.Store?.name || 'N/A',
        createdAt: staff.createdAt
      }
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

// POST /api/v1/staff — Create new staff account (Admin only)
exports.createStaff = async (req, res) => {
  try {
    const { username, password, fullname, phone, email, role, storeId } = req.body;

    if (!username || !password || !fullname || !phone) {
      return res.status(400).json({
        status: 'error',
        message: 'Tên đăng nhập, mật khẩu, họ tên và SĐT là bắt buộc'
      });
    }

    // Check duplicate username, phone, or email
    const orConditions = [{ username }, { phone }];
    if (email) orConditions.push({ email });

    const existing = await Staff.findOne({
      where: { [Op.or]: orConditions }
    });

    if (existing) {
      return res.status(409).json({
        status: 'error',
        message: 'Tên đăng nhập, số điện thoại hoặc email đã tồn tại'
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const staff = await Staff.create({
      storeId: storeId || 1,
      username,
      hashedPassword,
      fullname,
      phone,
      email: email || null,
      role: role || 'Cashier'
    });

    res.status(201).json({
      status: 'success',
      message: 'Tạo tài khoản nhân viên thành công',
      data: {
        staffId: staff.id,
        username: staff.username,
        fullname: staff.fullname,
        role: staff.role
      }
    });
  } catch (error) {
    console.error('Lỗi tạo tài khoản:', error);
    res.status(500).json({ status: 'error', message: error.message });
  }
};

// PUT /api/v1/staff/:id — Update staff info
exports.updateStaff = async (req, res) => {
  try {
    const staff = await Staff.findOne({
      where: { id: req.params.id, isDeleted: false }
    });

    if (!staff) {
      return res.status(404).json({ status: 'error', message: 'Không tìm thấy nhân viên' });
    }

    const { fullname, phone, email, storeId } = req.body;

    // Check duplicate phone/email (excluding current record)
    if (phone || email) {
      const orConditions = [];
      if (phone) orConditions.push({ phone });
      if (email) orConditions.push({ email });

      const duplicate = await Staff.findOne({
        where: {
          id: { [Op.ne]: staff.id },
          [Op.or]: orConditions
        }
      });

      if (duplicate) {
        return res.status(409).json({
          status: 'error',
          message: 'Số điện thoại hoặc email đã tồn tại'
        });
      }
    }

    await staff.update({
      fullname: fullname || staff.fullname,
      phone: phone || staff.phone,
      email: email !== undefined ? email : staff.email,
      storeId: storeId || staff.storeId
    });

    res.json({
      status: 'success',
      message: 'Cập nhật thông tin nhân viên thành công',
      data: {
        staffId: staff.id,
        fullname: staff.fullname,
        role: staff.role
      }
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

// PUT /api/v1/staff/:id/role — Assign role to staff (Admin only)
exports.assignRole = async (req, res) => {
  try {
    const staff = await Staff.findOne({
      where: { id: req.params.id, isDeleted: false }
    });

    if (!staff) {
      return res.status(404).json({ status: 'error', message: 'Không tìm thấy nhân viên' });
    }

    const { role } = req.body;
    const validRoles = ['Admin', 'Manager', 'Cashier', 'Staff'];

    if (!role || !validRoles.includes(role)) {
      return res.status(400).json({
        status: 'error',
        message: `Vai trò không hợp lệ. Chọn: ${validRoles.join(', ')}`
      });
    }

    await staff.update({ role });

    res.json({
      status: 'success',
      message: `Đã phân quyền ${role} cho ${staff.fullname}`,
      data: { staffId: staff.id, role: staff.role }
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

// PUT /api/v1/staff/:id/password — Reset staff password (Admin only)
exports.resetPassword = async (req, res) => {
  try {
    const staff = await Staff.findOne({
      where: { id: req.params.id, isDeleted: false }
    });

    if (!staff) {
      return res.status(404).json({ status: 'error', message: 'Không tìm thấy nhân viên' });
    }

    const { newPassword, confirmPassword } = req.body;

    if (!newPassword || newPassword.length < 6) {
      return res.status(400).json({
        status: 'error',
        message: 'Mật khẩu mới phải có ít nhất 6 ký tự'
      });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        status: 'error',
        message: 'Mật khẩu xác nhận không khớp'
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await staff.update({ hashedPassword });

    res.json({
      status: 'success',
      message: 'Đổi mật khẩu thành công'
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

// PUT /api/v1/staff/:id/deactivate — Deactivate staff account (soft delete)
exports.deactivateStaff = async (req, res) => {
  try {
    const staff = await Staff.findOne({
      where: { id: req.params.id, isDeleted: false }
    });

    if (!staff) {
      return res.status(404).json({ status: 'error', message: 'Không tìm thấy nhân viên' });
    }

    // Never hard delete — preserve audit trail (orders, warranty history)
    await staff.update({ isDeleted: true });

    res.json({
      status: 'success',
      message: `Đã vô hiệu hóa tài khoản của ${staff.fullname}`
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};
