const { Warranty, OrderDetail, Order, Variant, Product, Customer, Staff } = require('../models');
const { Op } = require('sequelize');

// GET /api/v1/warranty/search — Search warranty by phone or serial
exports.searchWarranty = async (req, res) => {
  try {
    const { q } = req.query;
    if (!q || q.length < 2) return res.json({ status: 'success', data: [] });

    // Search by customer phone or serial code
    const orders = await Order.findAll({
      where: { isDeleted: false, status: { [Op.in]: ['Completed', 'Warranty'] } },
      include: [
        {
          model: Customer,
          where: { phone: { [Op.like]: `%${q}%` } },
          required: false
        },
        {
          model: OrderDetail,
          where: q.length > 5 ? { serialCode: { [Op.like]: `%${q}%` } } : {},
          required: true,
          include: [{
            model: Variant,
            include: [{ model: Product, attributes: ['productName', 'warrantyPeriod'] }]
          }]
        },
        { model: Staff, attributes: ['fullname'] }
      ],
      order: [['createdAt', 'DESC']],
      limit: 20
    });

    const results = [];
    for (const order of orders) {
      for (const detail of order.OrderDetails || []) {
        const warrantyMonths = detail.Variant?.Product?.warrantyPeriod || 12;
        const purchaseDate = new Date(order.createdAt);
        const expiryDate = new Date(purchaseDate);
        expiryDate.setMonth(expiryDate.getMonth() + warrantyMonths);
        const isValid = new Date() <= expiryDate;

        results.push({
          orderId: order.id,
          detailId: detail.id,
          productName: detail.Variant?.Product?.productName || 'N/A',
          skuCode: detail.Variant?.skuCode || 'N/A',
          serialCode: detail.serialCode,
          purchaseDate: order.createdAt,
          warrantyExpiry: expiryDate,
          warrantyMonths,
          status: isValid ? 'Còn hạn' : 'Hết hạn',
          customerName: order.Customer?.fullname || 'Khách lẻ',
          customerPhone: order.Customer?.phone || 'N/A'
        });
      }
    }

    res.json({ status: 'success', data: results });
  } catch (error) {
    console.error('Warranty search error:', error);
    res.status(500).json({ status: 'error', message: error.message });
  }
};

// GET /api/v1/warranty/history — Warranty claim history
exports.getWarrantyHistory = async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const offset = (Number(page) - 1) * Number(limit);

    const { rows, count } = await Warranty.findAndCountAll({
      where: { isDeleted: false },
      include: [
        { model: Staff, attributes: ['fullname'] },
        {
          model: OrderDetail,
          include: [
            { model: Variant, include: [{ model: Product, attributes: ['productName'] }] },
            { model: Order, include: [{ model: Customer, attributes: ['fullname', 'phone'] }] }
          ]
        }
      ],
      order: [['id', 'DESC']],
      limit: Number(limit),
      offset
    });

    res.json({
      status: 'success',
      data: rows.map(w => ({
        warrantyId: w.id,
        claimDate: w.claimDate,
        productName: w.OrderDetail?.Variant?.Product?.productName || 'N/A',
        skuCode: w.OrderDetail?.Variant?.skuCode || 'N/A',
        customerName: w.OrderDetail?.Order?.Customer?.fullname || 'Khách lẻ',
        staffName: w.Staff?.fullname || 'N/A',
        issueDescription: w.issueDescription,
        resolutionType: w.resolutionType,
        warrantyType: w.warrantyType,
        refundAmount: Number(w.refundAmount || 0),
        status: w.status
      })),
      pagination: { totalItems: count, totalPages: Math.ceil(count / Number(limit)), currentPage: Number(page) }
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};
