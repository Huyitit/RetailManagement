const { Customer } = require('../models');
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


