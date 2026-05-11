const { Product, Variant, Category, Variant_Attribute_Value, Attribute, Promotion } = require('../models');

exports.getProducts = async (req, res) => {
  try {
    const { categoryId, q } = req.query;
    const where = {};
    if (categoryId && categoryId !== 'all') where.categoryId = categoryId;

    const products = await Product.findAll({
      where,
      include: [
        { model: Category },
        {
          model: Variant,
          include: [
            {
              model: Variant_Attribute_Value,
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
        p.Variants.some(v => v.SKU.toLowerCase().includes(q.toLowerCase()))
      );
    }

    const result = filtered.map(p => ({
      productId: p.productId,
      productName: p.productName,
      productImageUrl: p.Variants[0]?.imageUrl || '📦',
      productDescription: p.productDescription,
      taxRate: p.taxRate,
      warrantyPeriod: p.warrantyPeriod,
      categoryId: p.categoryId,
      category: p.Category?.categoryName,
      variants: p.Variants.map(v => {
        const raw = v.get({ plain: true });
        const rawAttrs = raw.attributeValues || raw.Variant_Attribute_Values || [];
        const attributes = rawAttrs.map(vav => ({
          name: vav.attribute?.attributeName || vav.Attribute?.attributeName || 'Thông số',
          value: vav.value
        }));
        const activePromo = raw.Promotions?.[0] || null;

        return {
          variantId: v.variantId,
          SKU: v.SKU,
          sellPrice: v.sellPrice,
          costPrice: v.costPrice,
          quantity: v.quantity,
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
      include: [{ model: Category }, { model: Variant, include: [{ model: Variant_Attribute_Value, as: 'attributeValues', include: [{ model: Attribute, as: 'attribute' }] }] }]
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
      where: { productId: req.params.id },
      include: [{ model: Variant_Attribute_Value, as: 'attributeValues', include: [{ model: Attribute, as: 'attribute' }] }]
    });
    res.json(variants);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getVariant = async (req, res) => {
  try {
    const variant = await Variant.findByPk(req.params.id, {
      include: [{ model: Product }, { model: Variant_Attribute_Value, as: 'attributeValues', include: [{ model: Attribute, as: 'attribute' }] }]
    });
    if (!variant) return res.status(404).json({ message: 'Không tìm thấy biến thể' });
    res.json(variant);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
