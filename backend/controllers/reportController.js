const { Order, OrderDetail, Variant, Product, Customer, Supplier, ImportReceipt, ImportDetail, ExportReceipt } = require('../models');
const sequelize = require('../configs/db');
const { Op } = require('sequelize');

// GET /api/v1/reports/revenue — Revenue report with date range
exports.getRevenueReport = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    if (!startDate || !endDate) {
      return res.status(400).json({ status: 'error', message: 'Cần "startDate" và "endDate"' });
    }

    // Summary KPIs
    const [summary] = await sequelize.query(`
      SELECT
        COUNT(*) as totalOrders,
        COALESCE(SUM(subTotal), 0) as totalSubTotal,
        COALESCE(SUM(discountAmount), 0) as totalDiscount,
        COALESCE(SUM(taxAmount), 0) as totalTax,
        COALESCE(SUM(finalTotal), 0) as totalRevenue,
        COALESCE(SUM(refundAmount), 0) as totalRefund
      FROM \`order\`
      WHERE isDeleted = 0
        AND status IN ('Completed', 'Warranty')
        AND DATE(createdAt) BETWEEN :startDate AND :endDate
    `, { replacements: { startDate, endDate }, type: sequelize.QueryTypes.SELECT });

    // Daily breakdown
    const dailyData = await sequelize.query(`
      SELECT
        DATE(createdAt) as date,
        COUNT(*) as orderCount,
        COALESCE(SUM(finalTotal), 0) as revenue,
        COALESCE(SUM(refundAmount), 0) as refund
      FROM \`order\`
      WHERE isDeleted = 0
        AND status IN ('Completed', 'Warranty')
        AND DATE(createdAt) BETWEEN :startDate AND :endDate
      GROUP BY DATE(createdAt)
      ORDER BY DATE(createdAt) ASC
    `, { replacements: { startDate, endDate }, type: sequelize.QueryTypes.SELECT });

    res.json({
      status: 'success',
      data: {
        summary: {
          totalOrders: Number(summary.totalOrders || 0),
          totalSubTotal: Number(summary.totalSubTotal || 0),
          totalDiscount: Number(summary.totalDiscount || 0),
          totalTax: Number(summary.totalTax || 0),
          totalRevenue: Number(summary.totalRevenue || 0),
          totalRefund: Number(summary.totalRefund || 0),
          netRevenue: Number(summary.totalRevenue || 0) - Number(summary.totalRefund || 0)
        },
        daily: dailyData
      }
    });
  } catch (error) {
    console.error('Revenue report error:', error);
    res.status(500).json({ status: 'error', message: error.message });
  }
};

// GET /api/v1/reports/revenue/:date — Drill-down: orders for a specific date
exports.getRevenueByDate = async (req, res) => {
  try {
    const { date } = req.params;
    const orders = await Order.findAll({
      where: {
        isDeleted: false,
        status: { [Op.in]: ['Completed', 'Warranty'] },
        createdAt: { [Op.between]: [`${date} 00:00:00`, `${date} 23:59:59`] }
      },
      include: [
        { model: Customer, attributes: ['fullname', 'phone'] },
        { model: OrderDetail, include: [{ model: Variant, include: [{ model: Product, attributes: ['productName'] }] }] }
      ],
      order: [['createdAt', 'DESC']]
    });

    res.json({
      status: 'success',
      data: orders.map(o => ({
        orderId: o.id,
        customerName: o.Customer?.fullname || 'Khách lẻ',
        createdAt: o.createdAt,
        paymentMethod: o.paymentMethod,
        finalTotal: Number(o.finalTotal || 0),
        refundAmount: Number(o.refundAmount || 0),
        itemCount: o.OrderDetails?.length || 0
      }))
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

// GET /api/v1/reports/inventory — Inventory report
exports.getInventoryReport = async (req, res) => {
  try {
    const { filter } = req.query; // 'all', 'low_stock', 'long_standing'

    const variants = await Variant.findAll({
      where: { isDeleted: false },
      include: [{ model: Product, where: { isDeleted: false }, attributes: ['productName', 'brand', 'categoryId'] }],
      order: [['stockQuantity', 'ASC']]
    });

    let filtered = variants;
    if (filter === 'low_stock') {
      filtered = variants.filter(v => v.stockQuantity <= v.minStock);
    } else if (filter === 'long_standing') {
      const sixMonthsAgo = new Date();
      sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
      filtered = variants.filter(v => new Date(v.updatedAt) < sixMonthsAgo && v.stockQuantity > 0);
    }

    // Summary stats
    const totalVariants = variants.length;
    const totalStock = variants.reduce((sum, v) => sum + v.stockQuantity, 0);
    const lowStockCount = variants.filter(v => v.stockQuantity <= v.minStock).length;
    const outOfStockCount = variants.filter(v => v.stockQuantity === 0).length;

    res.json({
      status: 'success',
      data: {
        summary: { totalVariants, totalStock, lowStockCount, outOfStockCount },
        items: filtered.map(v => ({
          variantId: v.id,
          skuCode: v.skuCode,
          productName: v.Product?.productName || 'N/A',
          brand: v.Product?.brand || 'N/A',
          stockQuantity: v.stockQuantity,
          minStock: v.minStock,
          sellPrice: Number(v.sellPrice || 0),
          importPrice: Number(v.importPrice || 0),
          stockValue: v.stockQuantity * Number(v.importPrice || 0)
        }))
      }
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

// GET /api/v1/reports/debt — Supplier debt report
exports.getDebtReport = async (req, res) => {
  try {
    const suppliers = await Supplier.findAll({
      where: { isDeleted: false },
      include: [{ model: ImportReceipt, where: { isDeleted: false }, required: false }]
    });

    const debtData = suppliers
      .map(s => {
        const totalImported = s.ImportReceipts?.reduce((sum, r) => sum + Number(r.totalAmount || 0), 0) || 0;
        // In a full system, paid amount would come from a payments table
        // For now, we calculate from available data
        return {
          supplierId: s.id,
          companyName: s.companyName,
          contactName: s.contactName,
          phone: s.phone,
          totalImported,
          totalPaid: 0, // Placeholder — would need a Payment model
          totalDebt: totalImported,
          receiptCount: s.ImportReceipts?.length || 0
        };
      })
      .filter(d => d.receiptCount > 0);

    res.json({
      status: 'success',
      data: debtData
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

// GET /api/v1/reports/debt/:supplierId — Supplier debt detail
exports.getDebtDetail = async (req, res) => {
  try {
    const { supplierId } = req.params;

    const supplier = await Supplier.findOne({ where: { id: supplierId, isDeleted: false } });
    if (!supplier) return res.status(404).json({ status: 'error', message: 'Không tìm thấy nhà cung cấp' });

    const receipts = await ImportReceipt.findAll({
      where: { supplierId, isDeleted: false },
      include: [{ model: ImportDetail, include: [{ model: Variant, include: [{ model: Product, attributes: ['productName'] }] }] }],
      order: [['importDate', 'DESC']]
    });

    res.json({
      status: 'success',
      data: {
        supplierId: supplier.id,
        companyName: supplier.companyName,
        receipts: receipts.map(r => ({
          receiptId: r.id,
          importDate: r.importDate,
          totalAmount: Number(r.totalAmount || 0),
          note: r.note,
          items: r.ImportDetails?.map(d => ({
            productName: d.Variant?.Product?.productName || 'N/A',
            skuCode: d.Variant?.skuCode || 'N/A',
            quantity: d.quantity,
            importPrice: Number(d.importPrice || 0),
            lineTotal: Number(d.lineTotal || 0)
          })) || []
        }))
      }
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

// GET /api/v1/reports/dashboard — Dashboard summary for homepage
exports.getDashboardStats = async (req, res) => {
  try {
    const todayStr = new Date().toISOString().split('T')[0];

    const [stats] = await sequelize.query(`
      SELECT
        (SELECT COUNT(*) FROM \`order\` WHERE isDeleted = 0 AND status IN ('Completed','Warranty') AND DATE(createdAt) = :today) as todayOrders,
        (SELECT COALESCE(SUM(finalTotal - COALESCE(refundAmount,0)),0) FROM \`order\` WHERE isDeleted = 0 AND status IN ('Completed','Warranty') AND DATE(createdAt) = :today) as todayRevenue,
        (SELECT COUNT(*) FROM variant WHERE isDeleted = 0) as totalVariants,
        (SELECT COUNT(*) FROM variant WHERE isDeleted = 0 AND stockQuantity <= minStock) as lowStockCount,
        (SELECT COUNT(*) FROM customer WHERE isDeleted = 0) as totalCustomers,
        (SELECT COUNT(*) FROM supplier WHERE isDeleted = 0) as totalSuppliers
    `, { replacements: { today: todayStr }, type: sequelize.QueryTypes.SELECT });

    res.json({
      status: 'success',
      data: {
        todayOrders: Number(stats.todayOrders || 0),
        todayRevenue: Number(stats.todayRevenue || 0),
        totalVariants: Number(stats.totalVariants || 0),
        lowStockCount: Number(stats.lowStockCount || 0),
        totalCustomers: Number(stats.totalCustomers || 0),
        totalSuppliers: Number(stats.totalSuppliers || 0)
      }
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};
