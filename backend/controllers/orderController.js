const fs = require('fs');
const path = require('path');
const {
  SaleOrder, SaleDetail, Receipt, Variant, Customer,
  Product, Profile, Promotion, Promotion_Variant, WarrantyLog
} = require('../models');
const Staff = require('../models/Staff');
const sequelize = require('../configs/db');
const { Op } = require('sequelize');

exports.createOrder = async (req, res) => {
  try {
    const { staffId, customerId } = req.body;
    if (!staffId) return res.status(400).json({ status: 'error', message: 'staffId là bắt buộc' });

    const [receiptRes] = await sequelize.query(
      `INSERT INTO [Receipt] (staffId, totalPrice, orderAt, type)
       OUTPUT INSERTED.receiptId
       VALUES (:staffId, 0, GETDATE(), 'SALE')`,
      { replacements: { staffId }, type: sequelize.QueryTypes.INSERT }
    );

    const receiptId = receiptRes[0].receiptId;

    const saleOrder = await SaleOrder.create({
      receiptId: receiptId,
      customerId: customerId || null,
      paymentMethod: 'Tiền mặt',
      saleStatus: 'Draft',
      refundAmount: 0,
      amountReceived: 0,
      amountChange: 0,
      paymentReference: null
    });

    res.status(201).json({
      status: 'success',
      data: {
        receiptId: receiptId,
        staffId: staffId || currentStaffId,
        customerId: saleOrder.customerId,
        status: saleOrder.saleStatus
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
    const offset = (page - 1) * limit;

    let whereClause = "WHERE SaleOrder.saleStatus IN ('Completed', 'Warranty') AND Receipt.type = 'SALE'";
    const replacements = {};

    if (startDate && endDate) {
      whereClause += " AND Receipt.orderAt BETWEEN :start AND :end";
      replacements.start = startDate;
      replacements.end = endDate;
    }

    if (search && search.trim() !== '') {
      const s = `%${search.trim()}%`;
      whereClause += " AND (CAST(SaleOrder.receiptId AS VARCHAR) LIKE :search OR Profile.fullName LIKE :search)";
      replacements.search = s;
    }

    const countQuery = `
      SELECT COUNT(*) as total
      FROM SaleOrder
      JOIN Receipt ON SaleOrder.receiptId = Receipt.receiptId
      LEFT JOIN Customer ON SaleOrder.customerId = Customer.customerId
      LEFT JOIN Profile ON Customer.profileId = Profile.profileId
      ${whereClause}
    `;

    const dataQuery = `
      SELECT
        SaleOrder.receiptId,
        Receipt.orderAt,
        ISNULL(Profile.fullName, N'Khách lẻ') as customerName,
        Receipt.totalPrice,
        ISNULL(SaleOrder.refundAmount, 0) as refundAmount,
        (Receipt.totalPrice - ISNULL(SaleOrder.refundAmount, 0)) as netTotal,
        SaleOrder.paymentMethod,
        SaleOrder.saleStatus
      FROM SaleOrder
      JOIN Receipt ON SaleOrder.receiptId = Receipt.receiptId
      LEFT JOIN Customer ON SaleOrder.customerId = Customer.customerId
      LEFT JOIN Profile ON Customer.profileId = Profile.profileId
      ${whereClause}
      ORDER BY SaleOrder.receiptId DESC
      OFFSET :offset ROWS FETCH NEXT :limit ROWS ONLY
    `;

    const [countResult] = await sequelize.query(countQuery, { replacements, type: sequelize.QueryTypes.SELECT });
    const orders = await sequelize.query(dataQuery, {
      replacements: { ...replacements, offset: parseInt(offset), limit: parseInt(limit) },
      type: sequelize.QueryTypes.SELECT
    });

    const totalItems = countResult?.total || 0;

    res.json({
      status: 'success',
      data: orders,
      pagination: {
        totalItems: totalItems,
        totalPages: Math.ceil(totalItems / limit),
        currentPage: parseInt(page),
        limit: parseInt(limit)
      }
    });
  } catch (error) {
    console.error("Error in getAllOrders:", error);
    res.status(500).json({ status: 'error', message: error.message });
  }
};

exports.getOrderStats = async (req, res) => {
  try {
    const todayStr = new Date().toISOString().split('T')[0];

    const statsQuery = `
      SELECT
        (SELECT COUNT(*) FROM SaleOrder JOIN Receipt ON SaleOrder.receiptId = Receipt.receiptId WHERE SaleOrder.saleStatus IN ('Completed', 'Warranty') AND Receipt.type = 'SALE' AND CAST(Receipt.orderAt AS DATE) = :today) as todayCount,
        (SELECT SUM(Receipt.totalPrice - ISNULL(SaleOrder.refundAmount, 0)) FROM SaleOrder JOIN Receipt ON SaleOrder.receiptId = Receipt.receiptId WHERE SaleOrder.saleStatus IN ('Completed', 'Warranty') AND Receipt.type = 'SALE' AND CAST(Receipt.orderAt AS DATE) = :today) as todayTotal,
        (SELECT COUNT(*) FROM SaleOrder JOIN Receipt ON SaleOrder.receiptId = Receipt.receiptId WHERE SaleOrder.saleStatus IN ('Completed', 'Warranty') AND Receipt.type = 'SALE' AND Receipt.orderAt >= DATEADD(day, -7, GETDATE())) as weekCount,
        (SELECT SUM(Receipt.totalPrice - ISNULL(SaleOrder.refundAmount, 0)) FROM SaleOrder JOIN Receipt ON SaleOrder.receiptId = Receipt.receiptId WHERE SaleOrder.saleStatus IN ('Completed', 'Warranty') AND Receipt.type = 'SALE' AND Receipt.orderAt >= DATEADD(day, -7, GETDATE())) as weekTotal,
        (SELECT COUNT(*) FROM SaleOrder WHERE saleStatus = 'Cancelled' OR (saleStatus = 'Warranty' AND refundAmount > 0)) as cancelledCount,
        (SELECT SUM(ISNULL(refundAmount, 0)) FROM SaleOrder WHERE saleStatus = 'Cancelled' OR (saleStatus = 'Warranty' AND refundAmount > 0)) as cancelledTotal
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
    const detail = await SaleDetail.findOne({ where: { receiptId: id, variantId } });
    if (!detail) return res.status(404).json({ status: 'error', message: 'Không tìm thấy' });
    await detail.update({ quantity });
    const allDetails = await SaleDetail.findAll({ where: { receiptId: id } });
    const total = allDetails.reduce((sum, d) => sum + (d.finalPrice * d.quantity), 0);
    await Receipt.update({ totalPrice: total }, { where: { receiptId: id } });
    res.json({ status: 'success' });
  } catch (error) { res.status(500).json({ status: 'error' }); }
};

exports.addOrderItem = async (req, res) => {
  try {
    const { id } = req.params;
    const { variantId, quantity } = req.body;
    const variant = await Variant.findByPk(variantId);
    if (!variant) return res.status(404).json({ status: 'error' });
    const [detail, created] = await SaleDetail.findOrCreate({ where: { receiptId: id, variantId }, defaults: { quantity, unitPrice: variant.sellPrice, finalPrice: variant.sellPrice } });
    if (!created) await detail.update({ quantity: detail.quantity + quantity });
    const allDetails = await SaleDetail.findAll({ where: { receiptId: id } });
    const total = allDetails.reduce((sum, d) => sum + (d.finalPrice * d.quantity), 0);
    await Receipt.update({ totalPrice: total }, { where: { receiptId: id } });
    res.json({ status: 'success' });
  } catch (error) { res.status(500).json({ status: 'error' }); }
};

exports.deleteOrderItem = async (req, res) => {
  try {
    const { orderId, variantId } = req.params;
    await SaleDetail.destroy({ where: { receiptId: orderId, variantId } });
    const allDetails = await SaleDetail.findAll({ where: { receiptId: orderId } });
    const total = allDetails.reduce((sum, d) => sum + (d.finalPrice * d.quantity), 0);
    await Receipt.update({ totalPrice: total }, { where: { receiptId: orderId } });
    res.json({ status: 'success' });
  } catch (error) { res.status(500).json({ status: 'error' }); }
};

exports.checkoutOrder = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const { id } = req.params;
    const { paymentMethod, amountReceived, amountChange, customerId, pointsToUse, pointsEarned } = req.body;

    const order = await SaleOrder.findOne({ where: { receiptId: id }, transaction });
    if (!order) throw new Error('Không tìm thấy đơn hàng');
    await order.update({
      paymentMethod,
      saleStatus: 'Completed',
      customerId: customerId || order.customerId,
      amountReceived: Number(amountReceived || 0),
      amountChange: Number(amountChange || 0)
    }, { transaction });
    const details = await SaleDetail.findAll({ where: { receiptId: id }, transaction });
    for (const d of details) {
      const v = await Variant.findByPk(d.variantId, { transaction });
      if (v) {
        if (v.quantity < d.quantity) throw new Error(`Sản phẩm ${v.SKU} không đủ hàng (Kho: ${v.quantity})`);
        await v.update({ quantity: v.quantity - d.quantity }, { transaction });
      }
    }
    const actualTotal = Number(amountReceived || 0) - Number(amountChange || 0);
    await Receipt.update({ totalPrice: actualTotal }, { where: { receiptId: id }, transaction });
    if (customerId) {
      const customer = await Customer.findByPk(customerId, { transaction });
      if (customer) {
        const actualPointsToUse = Math.min(Number(pointsToUse || 0), customer.rewardPoints || 0);
        const newPoints = Math.max(0, (customer.rewardPoints || 0) - actualPointsToUse + (Number(pointsEarned) || 0));
        await customer.update({ rewardPoints: newPoints }, { transaction });
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
    const logPath = path.join(__dirname, '..', 'trace_api.log');
    fs.appendFileSync(logPath, `[${new Date().toISOString()}] REQUEST getOrder ID: ${id}\n`);
    const order = await SaleOrder.findOne({
      where: { receiptId: id },
      include: [
        { model: Receipt, include: [{ model: Staff, include: [Profile] }] },
        { model: Customer, include: [Profile] },
        {
          model: SaleDetail,
          include: [{ model: Variant, include: [Product] }]
        },
        {
          model: WarrantyLog,
          include: [{ model: Staff, include: [Profile] }]
        }
      ]
    });

    fs.appendFileSync(logPath, `[${new Date().toISOString()}] RESULT for ID ${id}: ${order ? 'FOUND' : 'NOT FOUND'}\n`);
    if (!order) return res.status(404).json({ status: 'error', message: 'Không tìm thấy đơn hàng' });

    const result = {
      receiptId: order.receiptId,
      customerId: order.customerId,
      customerName: order.Customer?.Profile?.fullName || 'Khách lẻ',
      staffName: order.Receipt?.Staff?.Profile?.fullName || 'N/A',
      orderAt: order.Receipt?.orderAt,
      paymentMethod: order.paymentMethod,
      saleStatus: order.saleStatus,
      totalPrice: Number(order.Receipt?.totalPrice || 0),
      refundAmount: Number(order.refundAmount || 0),
      returnReason: order.returnReason,
      items: order.SaleDetails?.map(d => ({
        variantId: d.variantId,
        productName: d.Variant?.Product?.productName || "Sản phẩm",
        variantSKU: d.Variant?.SKU || "N/A",
        image: d.Variant?.imageUrl,
        warrantyPeriod: d.Variant?.Product?.warrantyPeriod || 12,
        quantity: d.quantity,
        returnedQuantity: d.returnedQuantity || 0,
        unitPrice: d.unitPrice,
        discountAmount: d.discountAmount,
        finalPrice: d.finalPrice
      })) || [],
      warrantyHistory: order.WarrantyLogs?.map(log => ({
        id: log.id,
        staffName: log.Staff?.Profile?.fullName || 'N/A',
        reason: log.reason,
        warrantyType: log.warrantyType,
        refundAmount: Number(log.refundAmount || 0),
        warrantyItems: JSON.parse(log.warrantyItems || '[]'),
        paymentMethod: log.paymentMethod,
        createdAt: log.createdAt
      })) || []
    };

    res.json({ status: 'success', data: result });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

exports.processReturn = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const id = parseInt(req.params.id);
    const { refundAmount, returnReason, items, staffId, warrantyType, paymentMethod } = req.body;

    console.log(`>>> [WARRANTY] START PROCESSING Order: ${id}, Type: ${warrantyType}, Refund: ${refundAmount}`);

    const [orderInfo] = await sequelize.query(
      `SELECT Receipt.orderAt FROM SaleOrder JOIN Receipt ON SaleOrder.receiptId = Receipt.receiptId WHERE SaleOrder.receiptId = :id`,
      { replacements: {id}, transaction, type: sequelize.QueryTypes.SELECT }
    );

    if (!orderInfo) throw new Error("Không tìm thấy đơn hàng gốc.");
    const orderDate = new Date(orderInfo.orderAt);

    const warrantyProducts = [];
    if (items && Array.isArray(items)) {
      for (const item of items) {
        const vId = parseInt(item.variantId);
        const qty = parseInt(item.returnQty);
        if (!qty || qty <= 0) continue;

        const [pInfo] = await sequelize.query(
          `SELECT p.productName, p.warrantyPeriod FROM Variant v JOIN Product p ON v.productId = p.productId WHERE v.variantId = :vId`,
          { replacements: { vId }, transaction, type: sequelize.QueryTypes.SELECT }
        );

        if (!pInfo) continue;

        const warrantyMonths = parseInt(pInfo.warrantyPeriod) || 12;
        const expirationDate = new Date(orderDate);
        expirationDate.setMonth(expirationDate.getMonth() + warrantyMonths);

        if (new Date() > expirationDate) {
          throw new Error(`Sản phẩm '${pInfo.productName}' đã hết hạn bảo hành (${warrantyMonths} tháng).`);
        }

        if (warrantyType === 'Replacement') {
          await sequelize.query(
            `UPDATE Variant SET quantity = quantity - :qty WHERE variantId = :vId`,
            { replacements: { qty, vId }, transaction }
          );
        } else if (warrantyType === 'Refund') {
          await sequelize.query(
            `UPDATE Variant SET quantity = quantity + :qty WHERE variantId = :vId`,
            { replacements: { qty, vId }, transaction }
          );
        }

        await sequelize.query(
          `UPDATE SaleDetail SET returnedQuantity = ISNULL(returnedQuantity, 0) + :qty WHERE receiptId = :id AND variantId = :vId`,
          { replacements: { qty, id, vId }, transaction }
        );

        warrantyProducts.push({ productName: pInfo.productName, quantity: qty });
      }
    }

    const finalRefund = (warrantyType === 'Refund') ? Math.round(Number(refundAmount) || 0) : 0;

    await sequelize.query(
      `UPDATE SaleOrder SET saleStatus = 'Warranty', refundAmount = ISNULL(refundAmount, 0) + :refund WHERE receiptId = :id`,
      { replacements: { refund: finalRefund, id }, transaction }
    );

    await sequelize.query(
      `INSERT INTO WarrantyLog (receiptId, staffId, reason, warrantyItems, warrantyType, refundAmount, paymentMethod, createdAt)
       VALUES (:id, :staffId, :reason, :items, :type, :refund, :paymentMethod, GETDATE())`,
      {
        replacements: {
          id,
          staffId: staffId || 1,
          reason: returnReason || 'Bảo hành sản phẩm',
          items: JSON.stringify(warrantyProducts),
          type: warrantyType,
          refund: finalRefund,
          paymentMethod: paymentMethod
        },
        transaction
      }
    );

    await transaction.commit();
    res.json({ status: 'success', message: 'Cập nhật bảo hành thành công' });
  } catch (error) {
    if (transaction) await transaction.rollback();
    console.error(">>> [WARRANTY ERROR]:", error);
    res.status(500).json({ status: 'error', message: `BACKEND ERROR: ${error.message} ${error.original?.message || ''}` });
  }
};

exports.getOrderPrint = async (req, res) => { res.json({ status: 'success' }); };