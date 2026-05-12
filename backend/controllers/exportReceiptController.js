const { ExportReceipt, ExportDetail, Supplier, Variant, Product } = require('../models');
const sequelize = require('../configs/db');
const { Op } = require('sequelize');

exports.getExportReceipts = async (req, res) => {
  try {
    const { page = 1, limit = 20, supplierId, startDate, endDate } = req.query;
    const offset = (Number(page) - 1) * Number(limit);
    const where = { isDeleted: false };
    if (supplierId) where.supplierId = supplierId;
    if (startDate && endDate) where.exportDate = { [Op.between]: [startDate, endDate] };

    const { rows, count } = await ExportReceipt.findAndCountAll({
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
        exportDate: r.exportDate,
        reason: r.reason,
        totalAmount: Number(r.totalAmount || 0)
      })),
      pagination: { totalItems: count, totalPages: Math.ceil(count / Number(limit)), currentPage: Number(page) }
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

exports.getExportReceipt = async (req, res) => {
  try {
    const receipt = await ExportReceipt.findOne({
      where: { id: req.params.id, isDeleted: false },
      include: [
        { model: Supplier },
        { model: ExportDetail, include: [{ model: Variant, include: [{ model: Product, attributes: ['productName'] }] }] }
      ]
    });
    if (!receipt) return res.status(404).json({ status: 'error', message: 'Không tìm thấy phiếu xuất' });

    res.json({
      status: 'success',
      data: {
        receiptId: receipt.id,
        supplierName: receipt.Supplier?.companyName || 'N/A',
        exportDate: receipt.exportDate,
        reason: receipt.reason,
        totalAmount: Number(receipt.totalAmount || 0),
        items: receipt.ExportDetails?.map(d => ({
          variantId: d.variantId,
          productName: d.Variant?.Product?.productName || 'N/A',
          skuCode: d.Variant?.skuCode || 'N/A',
          quantity: d.quantity,
          errorNote: d.errorNote
        })) || []
      }
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

exports.createExportReceipt = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const { supplierId, reason, items } = req.body;
    if (!supplierId) { await transaction.rollback(); return res.status(400).json({ status: 'error', message: 'Nhà cung cấp là bắt buộc' }); }
    if (!items || items.length === 0) { await transaction.rollback(); return res.status(400).json({ status: 'error', message: 'Danh sách sản phẩm trống' }); }

    let totalAmount = 0;
    const details = [];

    for (const item of items) {
      const variant = await Variant.findOne({ where: { id: item.variantId, isDeleted: false }, transaction });
      if (!variant) { await transaction.rollback(); return res.status(404).json({ status: 'error', message: `Variant ${item.variantId} không tồn tại` }); }

      if (variant.stockQuantity < item.quantity) {
        await transaction.rollback();
        return res.status(400).json({ status: 'error', message: `Số lượng xuất vượt quá tồn kho (${variant.skuCode}: kho còn ${variant.stockQuantity})` });
      }

      const price = Number(variant.importPrice) || 0;
      totalAmount += price * item.quantity;
      details.push({ variantId: item.variantId, quantity: item.quantity, errorNote: item.errorNote || null });
    }

    const receipt = await ExportReceipt.create({ supplierId, exportDate: new Date(), reason: reason || 'Trả nhà cung cấp', totalAmount }, { transaction });

    for (const d of details) {
      await ExportDetail.create({ exportReceiptId: receipt.id, ...d }, { transaction });
      await Variant.update({ stockQuantity: sequelize.literal(`stockQuantity - ${d.quantity}`) }, { where: { id: d.variantId }, transaction });
    }

    await transaction.commit();
    res.status(201).json({ status: 'success', message: 'Xuất kho thành công', data: { receiptId: receipt.id, totalAmount, itemCount: details.length } });
  } catch (error) {
    if (transaction) await transaction.rollback();
    res.status(500).json({ status: 'error', message: error.message });
  }
};
