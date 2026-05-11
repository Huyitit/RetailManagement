const { Customer, Profile } = require('../models');
const { Op } = require('sequelize');
exports.searchCustomers = async (req, res) => {
  try {
    const { q } = req.query;

    if (!q || q.length < 1) {
      return res.json([]);
    }

    const customers = await Customer.findAll({
      include: [{
        model: Profile,
        where: {
          [Op.or]: [
            { fullName: { [Op.like]: `%${q}%` } },
            { phoneNumber: { [Op.like]: `%${q}%` } }
          ]
        }
      }],
      limit: 10
    });

    const result = customers.map(c => ({
      customerId: c.customerId,
      fullName: c.Profile?.fullName,
      phoneNumber: c.Profile?.phoneNumber,
      rewardPoints: c.rewardPoints || 0,
      memberTier: c.memberTier || 'Bronze'
    }));

    res.json(result);
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};
exports.createCustomer = async (req, res) => {
  try {
    const { fullName, phoneNumber, gender, dateOfBirth, customerAddress } = req.body;

    if (!fullName || !phoneNumber) {
      return res.status(400).json({ status: 'error', message: 'Cần tên và số điện thoại' });
    }

    const existingProfile = await Profile.findOne({
      where: { phoneNumber: phoneNumber }
    });

    if (existingProfile) {
      return res.status(409).json({
        status: 'error',
        message: 'Số điện thoại đã được sử dụng'
      });
    }

    const profile = await Profile.create({
      fullName,
      phoneNumber,
      gender: gender || null,
      dateOfBirth: dateOfBirth || null,
      role: 'Customer'
    });

    const customer = await Customer.create({
      profileId: profile.profileId,
      rewardPoints: 0,
      memberTier: 'Bronze',
      customerAddress: customerAddress || null
    });

    res.status(201).json({
      status: 'success',
      message: 'Đã tạo khách hàng và áp dụng vào đơn hàng',
      data: {
        customerId: customer.customerId,
        fullName: profile.fullName,
        phoneNumber: profile.phoneNumber,
        rewardPoints: customer.rewardPoints,
        memberTier: customer.memberTier,
        appliedAt: new Date().toISOString()
      }
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

