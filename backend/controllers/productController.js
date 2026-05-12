const { Product, Variant, Category, VariantAttribute, Attribute, Promotion, OrderDetail, ImportDetail, ExportDetail } = require('../models');
const sequelize = require('../configs/db');
const { Op } = require('sequelize');

exports.getProducts = async (req, res) => {
  try {
    const { categoryId, q } = req.query;
    const where = { isDeleted: false };
    if (categoryId && categoryId !== 'all') where.categoryId = categoryId;

    const products = await Product.findAll({
      where,
      include: [
        { model: Category },
        {
          model: Variant,
          where: { isDeleted: false },
          include: [
            {
              model: VariantAttribute,
              as: 'attributeValues',
              include: [{ model: Attribute, as: 'attribute' }]
            },
            {
              model: Promotion,
              through: { attributes: [] }
            }
          ]
        }
      ]
    });

    let filtered = products;
    if (q) {
      filtered = products.filter(p =>
        p.productName.toLowerCase().includes(q.toLowerCase()) ||
        p.Variants.some(v => v.skuCode && v.skuCode.toLowerCase().includes(q.toLowerCase()))
      );
    }

    const result = filtered.map(p => ({
      productId: p.id,
      productName: p.productName,
      productImageUrl: p.Variants[0]?.imageUrl || '📦',
      productDescription: p.description,
      taxRate: p.taxRate,
      warrantyPeriod: p.warrantyPeriod,
      categoryId: p.categoryId,
      category: p.Category?.name,
      variants: p.Variants.map(v => {
        const raw = v.get({ plain: true });
        const rawAttrs = raw.attributeValues || [];
        const attributes = rawAttrs.map(vav => ({
          name: vav.attribute?.name || 'Thông số',
          value: vav.value
        }));
        const activePromo = raw.Promotions?.[0] || null;

        return {
          variantId: v.id,
          SKU: v.skuCode,
          sellPrice: v.sellPrice,
          costPrice: v.importPrice,
          quantity: v.stockQuantity,
          imageUrl: v.imageUrl,
          attributes: attributes,
          promotion: activePromo ? {
            name: activePromo.promotionName,
            discountPercent: activePromo.discountPercent
          } : null
        };
      })
    }));

    res.json(result);
  } catch (error) {
    console.error('Lỗi lấy sản phẩm:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.getProduct = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id, {
      include: [
        { model: Category }, 
        { 
          model: Variant, 
          include: [{ model: VariantAttribute, as: 'attributeValues', include: [{ model: Attribute, as: 'attribute' }] }] 
        }
      ]
    });
    if (!product) return res.status(404).json({ message: 'Không tìm thấy sản phẩm' });
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getProductVariants = async (req, res) => {
  try {
    const variants = await Variant.findAll({
      where: { productId: req.params.id, isDeleted: false },
      include: [{ model: VariantAttribute, as: 'attributeValues', include: [{ model: Attribute, as: 'attribute' }] }]
    });
    res.json(variants);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getVariant = async (req, res) => {
  try {
    const variant = await Variant.findByPk(req.params.id, {
      include: [{ model: Product }, { model: VariantAttribute, as: 'attributeValues', include: [{ model: Attribute, as: 'attribute' }] }]
    });
    if (!variant) return res.status(404).json({ message: 'Không tìm thấy biến thể' });
    res.json(variant);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST /api/v1/products — Create product with optional variants
exports.createProduct = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const { productName, categoryId, brand, description, warrantyPeriod, taxRate, variants } = req.body;

    if (!productName || !categoryId || !brand) {
      await transaction.rollback();
      return res.status(400).json({ status: 'error', message: 'Tên, danh mục và hãng SX là bắt buộc' });
    }

    const product = await Product.create({
      productName, categoryId, brand,
      description: description || null,
      warrantyPeriod: warrantyPeriod || 12,
      taxRate: taxRate || 0,
      status: 'Active'
    }, { transaction });

    // Create variants if provided
    if (variants && Array.isArray(variants) && variants.length > 0) {
      for (const v of variants) {
        // Check SKU duplicate
        if (v.skuCode) {
          const existing = await Variant.findOne({ where: { skuCode: v.skuCode }, transaction });
          if (existing) {
            await transaction.rollback();
            return res.status(409).json({ status: 'error', message: `Mã SKU "${v.skuCode}" đã tồn tại` });
          }
        }

        const variant = await Variant.create({
          productId: product.id,
          skuCode: v.skuCode || null,
          sellPrice: v.sellPrice || 0,
          importPrice: v.importPrice || 0,
          stockQuantity: v.stockQuantity || 0,
          imageUrl: v.imageUrl || null
        }, { transaction });

        // Create variant attributes
        if (v.attributes && Array.isArray(v.attributes)) {
          for (const attr of v.attributes) {
            let attribute = await Attribute.findOne({ where: { name: attr.name }, transaction });
            if (!attribute) attribute = await Attribute.create({ name: attr.name }, { transaction });

            await VariantAttribute.create({
              variantId: variant.id,
              attributeId: attribute.id,
              value: attr.value
            }, { transaction });
          }
        }
      }
    }

    await transaction.commit();
    res.status(201).json({
      status: 'success',
      message: 'Thêm sản phẩm thành công',
      data: { productId: product.id, productName: product.productName }
    });
  } catch (error) {
    if (transaction) await transaction.rollback();
    console.error('Lỗi tạo sản phẩm:', error);
    res.status(500).json({ status: 'error', message: error.message });
  }
};

// PUT /api/v1/products/:id — Update product general info
exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findOne({ where: { id: req.params.id, isDeleted: false } });
    if (!product) return res.status(404).json({ status: 'error', message: 'Không tìm thấy sản phẩm' });

    const { productName, categoryId, brand, description, warrantyPeriod, taxRate } = req.body;

    await product.update({
      productName: productName || product.productName,
      categoryId: categoryId || product.categoryId,
      brand: brand || product.brand,
      description: description !== undefined ? description : product.description,
      warrantyPeriod: warrantyPeriod !== undefined ? warrantyPeriod : product.warrantyPeriod,
      taxRate: taxRate !== undefined ? taxRate : product.taxRate
    });

    res.json({
      status: 'success',
      message: 'Cập nhật sản phẩm thành công',
      data: { productId: product.id, productName: product.productName }
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

// DELETE /api/v1/products/:id — Soft delete or deactivate product
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findOne({
      where: { id: req.params.id, isDeleted: false },
      include: [{ model: Variant, attributes: ['id'] }]
    });
    if (!product) return res.status(404).json({ status: 'error', message: 'Không tìm thấy sản phẩm' });

    const variantIds = product.Variants?.map(v => v.id) || [];

    // Check if any variant has transaction history
    let hasHistory = false;
    if (variantIds.length > 0) {
      const orderCount = await OrderDetail.count({ where: { variantId: { [Op.in]: variantIds } } });
      const importCount = await ImportDetail.count({ where: { variantId: { [Op.in]: variantIds } } });
      hasHistory = orderCount > 0 || importCount > 0;
    }

    if (hasHistory) {
      // Deactivate instead of delete
      await product.update({ status: 'Discontinued', isDeleted: true });
      await Variant.update({ isDeleted: true }, { where: { productId: product.id } });
      return res.json({ status: 'success', message: 'Sản phẩm đã chuyển sang trạng thái "Ngừng kinh doanh"' });
    }

    // Hard delete (no history)
    await VariantAttribute.destroy({ where: { variantId: { [Op.in]: variantIds } } });
    await Variant.destroy({ where: { productId: product.id } });
    await product.destroy();

    res.json({ status: 'success', message: 'Xóa sản phẩm thành công' });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};
