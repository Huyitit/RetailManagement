const { Variant, Product, VariantAttribute, Attribute, Promotion } = require('../models');
const sequelize = require('../configs/db');
const { Op } = require('sequelize');

// GET /api/v1/variants/search — Search variants by SKU or product name
exports.searchVariants = async (req, res) => {
  try {
    const { q } = req.query;
    if (!q || q.length < 1) return res.json([]);

    const variants = await Variant.findAll({
      where: { isDeleted: false },
      include: [{
        model: Product,
        where: {
          isDeleted: false,
          [Op.or]: [
            { productName: { [Op.like]: `%${q}%` } }
          ]
        },
        required: false,
        attributes: ['id', 'productName', 'brand']
      }, {
        model: VariantAttribute,
        as: 'attributeValues',
        include: [{ model: Attribute, as: 'attribute' }]
      }],
      limit: 20
    });

    // Also match by SKU directly
    const bySkuVariants = await Variant.findAll({
      where: {
        isDeleted: false,
        skuCode: { [Op.like]: `%${q}%` }
      },
      include: [{
        model: Product,
        where: { isDeleted: false },
        attributes: ['id', 'productName', 'brand']
      }, {
        model: VariantAttribute,
        as: 'attributeValues',
        include: [{ model: Attribute, as: 'attribute' }]
      }],
      limit: 10
    });

    // Merge and deduplicate
    const allVariants = [...variants.filter(v => v.Product), ...bySkuVariants];
    const seen = new Set();
    const unique = allVariants.filter(v => {
      if (seen.has(v.id)) return false;
      seen.add(v.id);
      return true;
    });

    res.json(unique.map(v => ({
      variantId: v.id,
      productId: v.Product?.id,
      productName: v.Product?.productName || 'N/A',
      brand: v.Product?.brand || '',
      skuCode: v.skuCode,
      sellPrice: Number(v.sellPrice || 0),
      importPrice: Number(v.importPrice || 0),
      stockQuantity: v.stockQuantity,
      imageUrl: v.imageUrl,
      attributes: v.attributeValues?.map(a => ({
        name: a.attribute?.name || '',
        value: a.value
      })) || []
    })));
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

// POST /api/v1/variants — Create a new variant for an existing product
exports.createVariant = async (req, res) => {
  try {
    const { productId, skuCode, sellPrice, importPrice, stockQuantity, imageUrl, attributes } = req.body;

    if (!productId || !sellPrice) {
      return res.status(400).json({ status: 'error', message: 'productId và sellPrice là bắt buộc' });
    }

    // Check product exists
    const product = await Product.findOne({ where: { id: productId, isDeleted: false } });
    if (!product) return res.status(404).json({ status: 'error', message: 'Sản phẩm không tồn tại' });

    // Check SKU duplicate
    if (skuCode) {
      const existing = await Variant.findOne({ where: { skuCode, isDeleted: false } });
      if (existing) return res.status(409).json({ status: 'error', message: `Mã SKU "${skuCode}" đã tồn tại` });
    }

    const variant = await Variant.create({
      productId,
      skuCode: skuCode || null,
      sellPrice,
      importPrice: importPrice || 0,
      stockQuantity: stockQuantity || 0,
      imageUrl: imageUrl || null
    });

    // Create variant attributes
    if (attributes && Array.isArray(attributes)) {
      for (const attr of attributes) {
        let attribute = await Attribute.findOne({ where: { name: attr.name } });
        if (!attribute) attribute = await Attribute.create({ name: attr.name });

        await VariantAttribute.create({
          variantId: variant.id,
          attributeId: attribute.id,
          value: attr.value
        });
      }
    }

    res.status(201).json({
      status: 'success',
      message: 'Thêm biến thể thành công',
      data: { variantId: variant.id, skuCode: variant.skuCode }
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

// PUT /api/v1/variants/:id — Update variant info (SKU locked)
exports.updateVariant = async (req, res) => {
  try {
    const variant = await Variant.findOne({ where: { id: req.params.id, isDeleted: false } });
    if (!variant) return res.status(404).json({ status: 'error', message: 'Không tìm thấy biến thể' });

    const { sellPrice, importPrice, discount, imageUrl, minStock } = req.body;

    // Validate numeric fields
    if (sellPrice !== undefined && (isNaN(sellPrice) || sellPrice < 0)) {
      return res.status(400).json({ status: 'error', message: 'Giá bán không hợp lệ' });
    }
    if (importPrice !== undefined && (isNaN(importPrice) || importPrice < 0)) {
      return res.status(400).json({ status: 'error', message: 'Giá nhập không hợp lệ' });
    }

    await variant.update({
      sellPrice: sellPrice !== undefined ? sellPrice : variant.sellPrice,
      importPrice: importPrice !== undefined ? importPrice : variant.importPrice,
      discount: discount !== undefined ? discount : variant.discount,
      imageUrl: imageUrl !== undefined ? imageUrl : variant.imageUrl,
      minStock: minStock !== undefined ? minStock : variant.minStock
    });

    res.json({ status: 'success', message: 'Cập nhật biến thể thành công', data: { variantId: variant.id } });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

// DELETE /api/v1/variants/:id — Soft delete variant
exports.deleteVariant = async (req, res) => {
  try {
    const variant = await Variant.findOne({ where: { id: req.params.id, isDeleted: false } });
    if (!variant) return res.status(404).json({ status: 'error', message: 'Không tìm thấy biến thể' });

    await variant.update({ isDeleted: true });
    res.json({ status: 'success', message: 'Xóa biến thể thành công' });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};
