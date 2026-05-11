const {
  SaleOrder, SaleDetail, Variant, Customer,
  Product, Promotion, Promotion_Variant, WarrantyLog, Staff
} = require('../models');
const sequelize = require('../configs/db');
const { Op } = require('sequelize');

exports.createOrder = async (req, res) => {
  try {
    const { staffId, customerId } = req.body;
    if (!staffId) return res.status(400).json({ status: 'error', message: 'staffId là bắt buộc' });

    const saleOrder = await SaleOrder.create({
      staffId: staffId,
      customerId: customerId || null,
      subTotal: 0,
      discountAmount: 0,
      taxAmount: 0,
      finalTotal: 0,
      paymentMethod: 'Tiền mặt',
      refundAmount: 0,
      status: 'Draft',
      isDeleted: false
    });

    res.status(201).json({
      status: 'success',
      data: {
        receiptId: saleOrder.id,
        staffId: saleOrder.staffId,
        customerId: saleOrder.customerId,
        status: 'Draft'
      }
    });
  } catch (error) {
    console.error("Error in createOrder:", error);
    res.status(500).json({ status: 'error', message: error.message });
  }
};


exports.getAllOrders = async (req, res) => {
  try {
    const { startDate, endDate, search, page = 1, limit = 20 } = req.query;
    const offset = (Number(page) - 1) * Number(limit);
    const limitNum = Number(limit);

    const { Op } = require('sequelize');
    const where = {
      isDeleted: false,
      status: { [Op.in]: ['Completed', 'Warranty'] }
    };

    if (startDate && endDate) {
      where.createdAt = { [Op.between]: [startDate, endDate] };
    }

    if (search && search.trim() !== '') {
      const s = `%${search.trim()}%`;
      where[Op.or] = [
        { id: { [Op.like]: s } },
        { '$Customer.fullname$': { [Op.like]: s } }
      ];
    }

    const { rows, count } = await SaleOrder.findAndCountAll({
      where,
      include: [
        { model: Staff, required: false },
        { model: Customer, required: false }
      ],
      order: [['id', 'DESC']],
      limit: limitNum,
      offset: offset,
      distinct: true
    });

    const orders = rows.map(o => ({
      receiptId: o.id,
      orderAt: o.createdAt,
      customerName: o.Customer?.fullname || 'Khách lẻ',
      staffName: o.Staff?.fullname || o.Staff?.username || 'N/A',
      totalPrice: Number(o.finalTotal || 0),
      refundAmount: Number(o.refundAmount || 0),
      netTotal: Number(o.finalTotal || 0) - Number(o.refundAmount || 0),
      paymentMethod: o.paymentMethod || 'Tiền mặt',
      saleStatus: o.status || 'Completed'
    }));

    res.json({
      status: 'success',
      data: orders,
      pagination: {
        totalItems: count,
        totalPages: Math.ceil(count / limitNum),
        currentPage: parseInt(page),
        limit: limitNum
      }
    });
  } catch (error) {
    console.error('Lỗi lấy đơn hàng:', error);
    res.status(500).json({ status: 'error', message: error.message });
  }
};

exports.getOrderStats = async (req, res) => {
  try {
    const todayStr = new Date().toISOString().split('T')[0];

    const statsQuery = `
      SELECT
        (SELECT COUNT(*) FROM \`order\` WHERE isDeleted = 0 AND DATE(createdAt) = :today) as todayCount,
        (SELECT SUM(finalTotal - COALESCE(refundAmount, 0)) FROM \`order\` WHERE isDeleted = 0 AND DATE(createdAt) = :today) as todayTotal,
        (SELECT COUNT(*) FROM \`order\` WHERE isDeleted = 0 AND createdAt >= DATE_SUB(NOW(), INTERVAL 7 DAY)) as weekCount,
        (SELECT SUM(finalTotal - COALESCE(refundAmount, 0)) FROM \`order\` WHERE isDeleted = 0 AND createdAt >= DATE_SUB(NOW(), INTERVAL 7 DAY)) as weekTotal,
        (SELECT COUNT(*) FROM \`order\` WHERE isDeleted = 0 AND refundAmount > 0) as cancelledCount,
        (SELECT SUM(COALESCE(refundAmount, 0)) FROM \`order\` WHERE isDeleted = 0 AND refundAmount > 0) as cancelledTotal
    `;

    const [stats] = await sequelize.query(statsQuery, { replacements: { today: todayStr }, type: sequelize.QueryTypes.SELECT });

    res.json({
      status: 'success',
      data: {
        today: { count: stats.todayCount || 0, total: Number(stats.todayTotal || 0) },
        week: { count: stats.weekCount || 0, total: Number(stats.weekTotal || 0) },
        cancelled: { count: stats.cancelledCount || 0, total: Number(stats.cancelledTotal || 0) }
      }
    });
  } catch (error) {
    console.error("Error in getOrderStats:", error);
    res.status(500).json({ status: 'error', message: error.message });
  }
};


exports.updateOrderItem = async (req, res) => {
  try {
    const { id } = req.params;
    const { variantId, quantity } = req.body;
    const detail = await SaleDetail.findOne({ where: { orderId: id, variantId } });
    if (!detail) return res.status(404).json({ status: 'error', message: 'Không tìm thấy' });

    const lineTotal = detail.unitPrice * quantity;
    await detail.update({ quantity, lineTotal });

    const allDetails = await SaleDetail.findAll({ where: { orderId: id } });
    const total = allDetails.reduce((sum, d) => sum + Number(d.lineTotal), 0);
    await SaleOrder.update({ finalTotal: total, subTotal: total }, { where: { id: id } });

    res.json({ status: 'success' });
  } catch (error) { res.status(500).json({ status: 'error' }); }
};

exports.addOrderItem = async (req, res) => {
  try {
    const { id } = req.params;
    const { variantId, quantity } = req.body;
    const variant = await Variant.findByPk(variantId);
    if (!variant) return res.status(404).json({ status: 'error' });

    const [detail, created] = await SaleDetail.findOrCreate({
      where: { orderId: id, variantId },
      defaults: {
        quantity,
        unitPrice: variant.sellPrice,
        lineTotal: variant.sellPrice * quantity,
        serialCode: 'N/A'
      }
    });

    if (!created) {
      const newQty = detail.quantity + quantity;
      await detail.update({
        quantity: newQty,
        lineTotal: detail.unitPrice * newQty
      });
    }

    const allDetails = await SaleDetail.findAll({ where: { orderId: id } });
    const total = allDetails.reduce((sum, d) => sum + Number(d.lineTotal), 0);
    await SaleOrder.update({ finalTotal: total, subTotal: total }, { where: { id: id } });

    res.json({ status: 'success' });
  } catch (error) { res.status(500).json({ status: 'error' }); }
};

exports.deleteOrderItem = async (req, res) => {
  try {
    const { orderId, variantId } = req.params;
    await SaleDetail.destroy({ where: { orderId, variantId } });

    const allDetails = await SaleDetail.findAll({ where: { orderId } });
    const total = allDetails.reduce((sum, d) => sum + Number(d.lineTotal), 0);
    await SaleOrder.update({ finalTotal: total, subTotal: total }, { where: { id: orderId } });

    res.json({ status: 'success' });
  } catch (error) { res.status(500).json({ status: 'error' }); }
};

exports.checkoutOrder = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const { id } = req.params;
    const {
      paymentMethod, customerId,
      pointsToUse, pointsEarned,
      subTotal, discountAmount, taxAmount, finalTotal
    } = req.body;

    const order = await SaleOrder.findOne({ where: { id: id }, transaction });
    if (!order) throw new Error('Không tìm thấy đơn hàng');

    await order.update({
      paymentMethod,
      customerId: customerId || order.customerId,
      subTotal: subTotal || order.subTotal,
      discountAmount: discountAmount || order.discountAmount,
      taxAmount: taxAmount || order.taxAmount,
      finalTotal: finalTotal || order.finalTotal,
      status: 'Completed'
    }, { transaction });

    const details = await SaleDetail.findAll({ where: { orderId: id }, transaction });
    for (const d of details) {
      const v = await Variant.findByPk(d.variantId, { transaction });
      if (v) {
        if (v.stockQuantity < d.quantity) throw new Error(`Sản phẩm ${v.skuCode} không đủ hàng (Kho: ${v.stockQuantity})`);
        await v.update({ stockQuantity: v.stockQuantity - d.quantity }, { transaction });
      }
    }

    if (customerId) {
      const customer = await Customer.findByPk(customerId, { transaction });
      if (customer) {
        const actualPointsToUse = Math.min(Number(pointsToUse || 0), customer.points || 0);
        const newPoints = Math.max(0, (customer.points || 0) - actualPointsToUse + (Number(pointsEarned) || 0));
        await customer.update({ points: newPoints }, { transaction });
      }
    }

    await transaction.commit();
    res.json({ status: 'success', message: 'Thanh toán hoàn tất', receiptId: id });
  } catch (error) {
    if (transaction) await transaction.rollback();
    console.error("Checkout Error:", error);
    res.status(500).json({ status: 'error', message: error.message });
  }
};


exports.getOrder = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await SaleOrder.findOne({
      where: { id: id },
      include: [
        { model: Staff },
        { model: Customer },
        {
          model: SaleDetail,
          include: [{ model: Variant, include: [Product] }]
        }
      ]
    });

    if (!order) return res.status(404).json({ status: 'error', message: 'Không tìm thấy đơn hàng' });

    const warranties = await WarrantyLog.findAll({
      include: [
        { model: Staff },
        {
          model: SaleDetail,
          where: { orderId: id },
          include: [{ model: Variant, include: [Product] }]
        }
      ]
    });

    const result = {
      receiptId: order.id,
      customerId: order.customerId,
      customerName: order.Customer?.fullname || 'Khách lẻ',
      staffName: order.Staff?.fullname || 'N/A',
      orderAt: order.createdAt,
      paymentMethod: order.paymentMethod,
      saleStatus: order.status || 'Completed',
      totalPrice: Number(order.finalTotal || 0),
      refundAmount: Number(order.refundAmount || 0),
      netTotal: Number(order.finalTotal || 0) - Number(order.refundAmount || 0),
      items: order.SaleDetails?.map(d => ({
        variantId: d.variantId,
        productName: d.Variant?.Product?.productName || "Sản phẩm",
        variantSKU: d.Variant?.skuCode || "N/A",
        image: d.Variant?.imageUrl,
        warrantyPeriod: d.Variant?.Product?.warrantyPeriod || 12,
        quantity: d.quantity,
        returnedQuantity: d.returnedQuantity || 0,
        unitPrice: d.unitPrice,
        discountAmount: d.totalDiscount,
        finalPrice: d.lineTotal,
        detailId: d.id
      })) || [],
      warrantyHistory: warranties.map(log => ({
        id: log.id,
        staffName: log.Staff?.fullname || 'N/A',
        reason: log.issueDescription,
        warrantyType: log.warrantyType,
        refundAmount: Number(log.refundAmount || 0),
        warrantyItems: [{
          productName: log.SaleDetail?.Variant?.Product?.productName || 'Sản phẩm',
          quantity: 1
        }],
        paymentMethod: log.paymentMethod,
        createdAt: log.createdAt
      })) || []
    };

    res.json({ status: 'success', data: result });
  } catch (error) {
    console.error("GetOrder Error:", error);
    res.status(500).json({ status: 'error', message: error.message });
  }
};


exports.processReturn = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const id = parseInt(req.params.id);
    const { refundAmount, returnReason, items, staffId, warrantyType, paymentMethod } = req.body;

    const totalRefund = (warrantyType === 'Refund') ? Math.round(Number(refundAmount) || 0) : 0;

    const order = await SaleOrder.findByPk(id, { transaction });
    if (!order) throw new Error("Không tìm thấy đơn hàng gốc.");

    if (items && Array.isArray(items)) {
      for (const item of items) {
        const vId = parseInt(item.variantId);
        const qty = parseInt(item.returnQty);
        if (!qty || qty <= 0) continue;

        const detail = await SaleDetail.findOne({
          where: { orderId: id, variantId: vId },
          include: [{ model: Variant, include: [Product] }],
          transaction
        });

        if (!detail) continue;

        const warrantyMonths = parseInt(detail.Variant?.Product?.warrantyPeriod) || 12;
        const orderDate = new Date(order.createdAt);
        const expirationDate = new Date(orderDate);
        expirationDate.setMonth(expirationDate.getMonth() + warrantyMonths);

        if (new Date() > expirationDate) {
          throw new Error(`Sản phẩm '${detail.Variant?.Product?.productName}' đã hết hạn bảo hành (${warrantyMonths} tháng).`);
        }

        if (warrantyType === 'Replacement') {
          await Variant.update(
            { stockQuantity: sequelize.literal(`stockQuantity - ${qty}`) },
            { where: { id: vId }, transaction }
          );
        } else if (warrantyType === 'Refund') {
          await Variant.update(
            { stockQuantity: sequelize.literal(`stockQuantity + ${qty}`) },
            { where: { id: vId }, transaction }
          );
        }

        await detail.update(
          { returnedQuantity: Number(detail.returnedQuantity || 0) + qty },
          { transaction }
        );

        const finalRefundForItem = (warrantyType === 'Refund') ? Math.round((detail.unitPrice * qty) * 1.1) : 0;

        await WarrantyLog.create({
          orderDetailId: detail.id,
          staffId: staffId || 1,
          claimDate: new Date(),
          issueDescription: returnReason || 'Bảo hành sản phẩm',
          resolutionType: warrantyType === 'Refund' ? 'Refund' : 'Replacement',
          status: 'Completed',
          refundAmount: finalRefundForItem,
          paymentMethod: paymentMethod,
          warrantyType: warrantyType
        }, { transaction });
      }
    }

    await order.update(
      {
        refundAmount: Number(order.refundAmount || 0) + totalRefund,
        status: 'Warranty'
      },
      { transaction }
    );

    await transaction.commit();
    res.json({ status: 'success', message: 'Cập nhật bảo hành thành công' });
  } catch (error) {
    if (transaction) await transaction.rollback();
    console.error(">>> [WARRANTY ERROR]:", error);
    res.status(500).json({ status: 'error', message: `BACKEND ERROR: ${error.message}` });
  }
};

exports.getOrderPrint = async (req, res) => { res.json({ status: 'success' }); };