const { ImportReceipt, ImportDetail, Supplier, Variant, Product } = require('../models');
const sequelize = require('../configs/db');
const { Op } = require('sequelize');

exports.getImportReceipts = async (req, res) => {
  try {
    const { page = 1, limit = 20, supplierId, startDate, endDate } = req.query;
    const offset = (Number(page) - 1) * Number(limit);
    const where = { isDeleted: false };
    if (supplierId) where.supplierId = supplierId;
    if (startDate && endDate) where.importDate = { [Op.between]: [startDate, endDate] };

    const { rows, count } = await ImportReceipt.findAndCountAll({
      where,
      include: [{ model: Supplier, attributes: ['companyName', 'phone'] }],
      order: [['id', 'DESC']],
      limit: Number(limit),
      offset
    });

    res.json({
      status: 'success',
      data: rows.map(r => ({
        receiptId: r.id,
        supplierName: r.Supplier?.companyName || 'N/A',
        importDate: r.importDate,
        totalAmount: Number(r.totalAmount || 0),
        note: r.note
      })),
      pagination: { totalItems: count, totalPages: Math.ceil(count / Number(limit)), currentPage: Number(page) }
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

exports.getImportReceipt = async (req, res) => {
  try {
    const receipt = await ImportReceipt.findOne({
      where: { id: req.params.id, isDeleted: false },
      include: [
        { model: Supplier },
        { model: ImportDetail, include: [{ model: Variant, include: [{ model: Product, attributes: ['productName'] }] }] }
      ]
    });
    if (!receipt) return res.status(404).json({ status: 'error', message: 'Không tìm thấy phiếu nhập' });

    res.json({
      status: 'success',
      data: {
        receiptId: receipt.id,
        supplierName: receipt.Supplier?.companyName || 'N/A',
        importDate: receipt.importDate,
        totalAmount: Number(receipt.totalAmount || 0),
        note: receipt.note,
        items: receipt.ImportDetails?.map(d => ({
          variantId: d.variantId,
          productName: d.Variant?.Product?.productName || 'N/A',
          skuCode: d.Variant?.skuCode || 'N/A',
          quantity: d.quantity,
          importPrice: Number(d.importPrice || 0),
          lineTotal: Number(d.lineTotal || 0)
        })) || []
      }
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

exports.createImportReceipt = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const { supplierId, note, items } = req.body;
    if (!supplierId) { await transaction.rollback(); return res.status(400).json({ status: 'error', message: 'Nhà cung cấp là bắt buộc' }); }
    if (!items || !Array.isArray(items) || items.length === 0) { await transaction.rollback(); return res.status(400).json({ status: 'error', message: 'Danh sách sản phẩm trống' }); }

    const supplier = await Supplier.findOne({ where: { id: supplierId, isDeleted: false }, transaction });
    if (!supplier) { await transaction.rollback(); return res.status(404).json({ status: 'error', message: 'Nhà cung cấp không tồn tại' }); }

    const seenVariants = new Set();
    for (const item of items) {
      if (!item?.variantId) { await transaction.rollback(); return res.status(400).json({ status: 'error', message: 'Thiếu mã biến thể' }); }
      if (seenVariants.has(item.variantId)) {
        await transaction.rollback();
        return res.status(400).json({ status: 'error', message: 'Danh sách sản phẩm bị trùng biến thể' });
      }
      seenVariants.add(item.variantId);

      const qty = Number(item.quantity);
      if (!Number.isFinite(qty) || !Number.isInteger(qty) || qty <= 0) {
        await transaction.rollback();
        return res.status(400).json({ status: 'error', message: 'Số lượng nhập phải là số nguyên dương' });
      }

      if (item.importPrice !== undefined && item.importPrice !== null) {
        const price = Number(item.importPrice);
        if (!Number.isFinite(price) || price < 0) {
          await transaction.rollback();
          return res.status(400).json({ status: 'error', message: 'Giá nhập không hợp lệ' });
        }
      }
    }

    let totalAmount = 0;
    const details = [];

    for (const item of items) {
      const variant = await Variant.findOne({ where: { id: item.variantId, isDeleted: false }, transaction });
      if (!variant) { await transaction.rollback(); return res.status(404).json({ status: 'error', message: `Variant ${item.variantId} không tồn tại` }); }

      const quantity = Number(item.quantity);
      const price = item.importPrice !== undefined && item.importPrice !== null
        ? Number(item.importPrice)
        : Number(variant.importPrice) || 0;
      const lineTotal = price * quantity;
      totalAmount += lineTotal;
      details.push({ variantId: item.variantId, supplierId, quantity, importPrice: price, lineTotal, batchNumber: item.batchNumber || null });
    }

    const receipt = await ImportReceipt.create({ supplierId, importDate: new Date(), totalAmount, note: note || null }, { transaction });

    for (const d of details) {
      await ImportDetail.create({ importReceiptId: receipt.id, ...d }, { transaction });
      await Variant.update({ stockQuantity: sequelize.literal(`stockQuantity + ${d.quantity}`) }, { where: { id: d.variantId }, transaction });
      if (d.importPrice !== null && d.importPrice !== undefined) {
        await Variant.update({ importPrice: d.importPrice }, { where: { id: d.variantId }, transaction });
      }
    }

    await transaction.commit();
    res.status(201).json({ status: 'success', message: 'Lập phiếu nhập kho thành công', data: { receiptId: receipt.id, totalAmount, itemCount: details.length } });
  } catch (error) {
    if (transaction) await transaction.rollback();
    res.status(500).json({ status: 'error', message: error.message });
  }
};
