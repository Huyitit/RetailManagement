const { Customer, Order } = require('../models');
const { Op } = require('sequelize');

exports.searchCustomers = async (req, res) => {
  try {
    const { q } = req.query;

    if (!q || q.length < 1) {
      return res.json([]);
    }

    const customers = await Customer.findAll({
      where: {
        isDeleted: false,
        [Op.or]: [
          { fullname: { [Op.like]: `%${q}%` } },
          { phone: { [Op.like]: `%${q}%` } }
        ]
      },
      limit: 10
    });

    const result = customers.map(c => ({
      customerId: c.id,
      fullName: c.fullname,
      phoneNumber: c.phone,
      rewardPoints: c.points || 0,
      memberTier: 'Bronze'
    }));

    res.json(result);
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

exports.createCustomer = async (req, res) => {
  try {
    const { fullName, phoneNumber, email } = req.body;

    if (!fullName || !phoneNumber) {
      return res.status(400).json({ status: 'error', message: 'Cần tên và số điện thoại' });
    }

    const existingCustomer = await Customer.findOne({
      where: { phone: phoneNumber, isDeleted: false }
    });

    if (existingCustomer) {
      return res.status(409).json({
        status: 'error',
        message: 'Số điện thoại đã được sử dụng'
      });
    }

    const customer = await Customer.create({
      fullname: fullName,
      phone: phoneNumber,
      email: email || '',
      points: 0
    });

    res.status(201).json({
      status: 'success',
      message: 'Đã tạo khách hàng và áp dụng vào đơn hàng',
      data: {
        customerId: customer.id,
        fullName: customer.fullname,
        phoneNumber: customer.phone,
        rewardPoints: customer.points,
        memberTier: 'Bronze',
        appliedAt: new Date().toISOString()
      }
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

// GET /api/v1/customers — List all customers with pagination
exports.getCustomers = async (req, res) => {
  try {
    const { q, page = 1, limit = 20 } = req.query;
    const offset = (Number(page) - 1) * Number(limit);
    const where = { isDeleted: false };

    if (q && q.trim()) {
      const search = `%${q.trim()}%`;
      where[Op.or] = [
        { fullname: { [Op.like]: search } },
        { phone: { [Op.like]: search } },
        { email: { [Op.like]: search } }
      ];
    }

    const { rows, count } = await Customer.findAndCountAll({
      where,
      order: [['id', 'DESC']],
      limit: Number(limit),
      offset
    });

    res.json({
      status: 'success',
      data: rows.map(c => ({
        customerId: c.id,
        fullName: c.fullname,
        phoneNumber: c.phone,
        email: c.email,
        rewardPoints: c.points || 0,
        memberTier: 'Bronze' // Could be dynamic based on points
      })),
      pagination: {
        totalItems: count,
        totalPages: Math.ceil(count / Number(limit)),
        currentPage: Number(page),
        limit: Number(limit)
      }
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

// GET /api/v1/customers/:id — Get customer detail
exports.getCustomer = async (req, res) => {
  try {
    const customer = await Customer.findOne({
      where: { id: req.params.id, isDeleted: false }
    });

    if (!customer) {
      return res.status(404).json({ status: 'error', message: 'Không tìm thấy khách hàng' });
    }

    res.json({
      status: 'success',
      data: {
        customerId: customer.id,
        fullName: customer.fullname,
        phoneNumber: customer.phone,
        email: customer.email,
        rewardPoints: customer.points || 0,
        memberTier: 'Bronze'
      }
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

// PUT /api/v1/customers/:id — Update customer info
exports.updateCustomer = async (req, res) => {
  try {
    const customer = await Customer.findOne({
      where: { id: req.params.id, isDeleted: false }
    });

    if (!customer) {
      return res.status(404).json({ status: 'error', message: 'Không tìm thấy khách hàng' });
    }

    const { fullName, phoneNumber, email } = req.body;

    // Check duplicate phone (excluding current)
    if (phoneNumber) {
      const existing = await Customer.findOne({
        where: { id: { [Op.ne]: customer.id }, phone: phoneNumber, isDeleted: false }
      });
      if (existing) {
        return res.status(409).json({ status: 'error', message: 'Số điện thoại đã được sử dụng' });
      }
    }

    await customer.update({
      fullname: fullName || customer.fullname,
      phone: phoneNumber || customer.phone,
      email: email !== undefined ? email : customer.email
    });

    res.json({
      status: 'success',
      message: 'Cập nhật thông tin khách hàng thành công',
      data: {
        customerId: customer.id,
        fullName: customer.fullname,
        phoneNumber: customer.phone
      }
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

// DELETE /api/v1/customers/:id — Soft delete customer
exports.deleteCustomer = async (req, res) => {
  try {
    const customer = await Customer.findOne({
      where: { id: req.params.id, isDeleted: false }
    });

    if (!customer) {
      return res.status(404).json({ status: 'error', message: 'Không tìm thấy khách hàng' });
    }

    const orderCount = await Order.count({ where: { customerId: customer.id } });
    if (orderCount > 0) {
      return res.status(409).json({
        status: 'error',
        message: 'Khách hàng đã có giao dịch, không thể xóa'
      });
    }

    await customer.update({ isDeleted: true });

    res.json({ status: 'success', message: 'Xóa hồ sơ khách hàng thành công' });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};
