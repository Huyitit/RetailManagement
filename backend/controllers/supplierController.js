const { Supplier, ImportReceipt, ImportDetail, ExportReceipt, Product, ProductSupplier } = require('../models');
const { Op } = require('sequelize');

// GET /api/v1/suppliers — List all suppliers with optional search
exports.getSuppliers = async (req, res) => {
  try {
    const { q, page = 1, limit = 20 } = req.query;
    const offset = (Number(page) - 1) * Number(limit);
    const where = { isDeleted: false };

    if (q && q.trim()) {
      const search = `%${q.trim()}%`;
      where[Op.or] = [
        { companyName: { [Op.like]: search } },
        { contactName: { [Op.like]: search } },
        { phone: { [Op.like]: search } },
        { email: { [Op.like]: search } }
      ];
    }

    const { rows, count } = await Supplier.findAndCountAll({
      where,
      order: [['id', 'DESC']],
      limit: Number(limit),
      offset
    });

    res.json({
      status: 'success',
      data: rows.map(s => ({
        supplierId: s.id,
        companyName: s.companyName,
        contactName: s.contactName,
        phone: s.phone,
        email: s.email,
        address: s.address,
        taxCode: s.taxCode
      })),
      pagination: {
        totalItems: count,
        totalPages: Math.ceil(count / Number(limit)),
        currentPage: Number(page),
        limit: Number(limit)
      }
    });
  } catch (error) {
    console.error('Lỗi lấy danh sách NCC:', error);
    res.status(500).json({ status: 'error', message: error.message });
  }
};

// GET /api/v1/suppliers/search — Search suppliers (lightweight for import/export slip forms)
exports.searchSuppliers = async (req, res) => {
  try {
    const { q } = req.query;
    if (!q || q.length < 1) return res.json([]);

    const suppliers = await Supplier.findAll({
      where: {
        isDeleted: false,
        [Op.or]: [
          { companyName: { [Op.like]: `%${q}%` } },
          { contactName: { [Op.like]: `%${q}%` } },
          { phone: { [Op.like]: `%${q}%` } }
        ]
      },
      limit: 10
    });

    res.json(suppliers.map(s => ({
      supplierId: s.id,
      companyName: s.companyName,
      contactName: s.contactName,
      phone: s.phone,
      address: s.address
    })));
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

// GET /api/v1/suppliers/:id — Get supplier detail
exports.getSupplier = async (req, res) => {
  try {
    const supplier = await Supplier.findOne({
      where: { id: req.params.id, isDeleted: false },
      include: [
        { model: Product, through: { attributes: [] } }
      ]
    });

    if (!supplier) {
      return res.status(404).json({ status: 'error', message: 'Không tìm thấy nhà cung cấp' });
    }

    res.json({
      status: 'success',
      data: {
        supplierId: supplier.id,
        companyName: supplier.companyName,
        contactName: supplier.contactName,
        phone: supplier.phone,
        email: supplier.email,
        address: supplier.address,
        taxCode: supplier.taxCode,
        products: supplier.Products?.map(p => ({
          productId: p.id,
          productName: p.productName
        })) || []
      }
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

// POST /api/v1/suppliers — Create new supplier
exports.createSupplier = async (req, res) => {
  try {
    const { companyName, contactName, phone, email, address, taxCode } = req.body;

    if (!companyName || !contactName || !phone) {
      return res.status(400).json({
        status: 'error',
        message: 'Tên công ty, tên liên hệ và số điện thoại là bắt buộc'
      });
    }

    // Check duplicate phone or email
    const existing = await Supplier.findOne({
      where: {
        isDeleted: false,
        [Op.or]: [
          { phone },
          ...(email ? [{ email }] : []),
          ...(taxCode ? [{ taxCode }] : [])
        ]
      }
    });

    if (existing) {
      return res.status(409).json({
        status: 'error',
        message: 'Số điện thoại, email hoặc mã số thuế đã tồn tại trong hệ thống'
      });
    }

    const supplier = await Supplier.create({
      companyName,
      contactName,
      phone,
      email: email || null,
      address: address || null,
      taxCode: taxCode || null
    });

    res.status(201).json({
      status: 'success',
      message: 'Thêm nhà cung cấp thành công',
      data: {
        supplierId: supplier.id,
        companyName: supplier.companyName,
        contactName: supplier.contactName,
        phone: supplier.phone
      }
    });
  } catch (error) {
    console.error('Lỗi tạo NCC:', error);
    res.status(500).json({ status: 'error', message: error.message });
  }
};

// PUT /api/v1/suppliers/:id — Update supplier info
exports.updateSupplier = async (req, res) => {
  try {
    const supplier = await Supplier.findOne({
      where: { id: req.params.id, isDeleted: false }
    });

    if (!supplier) {
      return res.status(404).json({ status: 'error', message: 'Không tìm thấy nhà cung cấp' });
    }

    const { companyName, contactName, phone, email, address, taxCode } = req.body;

    // Check duplicate phone/email (excluding current record)
    if (phone || email) {
      const orConditions = [];
      if (phone) orConditions.push({ phone });
      if (email) orConditions.push({ email });

      const duplicate = await Supplier.findOne({
        where: {
          id: { [Op.ne]: supplier.id },
          isDeleted: false,
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

    await supplier.update({
      companyName: companyName || supplier.companyName,
      contactName: contactName || supplier.contactName,
      phone: phone || supplier.phone,
      email: email !== undefined ? email : supplier.email,
      address: address !== undefined ? address : supplier.address,
      taxCode: taxCode !== undefined ? taxCode : supplier.taxCode
    });

    res.json({
      status: 'success',
      message: 'Cập nhật nhà cung cấp thành công',
      data: {
        supplierId: supplier.id,
        companyName: supplier.companyName,
        contactName: supplier.contactName,
        phone: supplier.phone
      }
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

// DELETE /api/v1/suppliers/:id — Soft delete supplier
exports.deleteSupplier = async (req, res) => {
  try {
    const supplier = await Supplier.findOne({
      where: { id: req.params.id, isDeleted: false }
    });

    if (!supplier) {
      return res.status(404).json({ status: 'error', message: 'Không tìm thấy nhà cung cấp' });
    }

    // Check if supplier has import/export history
    const importCount = await ImportReceipt.count({ where: { supplierId: supplier.id } });
    const exportCount = await ExportReceipt.count({ where: { supplierId: supplier.id } });

    if (importCount > 0 || exportCount > 0) {
      return res.status(409).json({
        status: 'error',
        message: 'Nhà cung cấp đã có lịch sử giao dịch, không thể xóa'
      });
    }

    // Hard delete if no transaction history
    await supplier.destroy();
    res.json({ status: 'success', message: 'Xóa nhà cung cấp thành công' });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};
