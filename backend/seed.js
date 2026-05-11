const {
  sequelize, Store, Staff, Customer, Supplier, Category,
  Product, Variant, SaleOrder, SaleDetail, Promotion, Promotion_Variant,
  Attribute, Variant_Attribute_Value
} = require('./models');

const bcrypt = require('bcryptjs');

async function seed() {
  try {
    const hashedPW = await bcrypt.hash('123', 10);
    console.log('🌌 KHỞI ĐỘNG CHIẾN DỊCH "SIÊU GALAXY DỮ LIỆU" (MYSQL VERSION)...');
    await sequelize.query('SET FOREIGN_KEY_CHECKS = 0');
    await sequelize.sync({ force: true });
    await sequelize.query('SET FOREIGN_KEY_CHECKS = 1');

    // 1. Create Store
    await Store.create({ name: 'Huyitit Retail', phone: '0123456789', email: 'contact@huyitit.com', address: '123 Retail St', taxCode: 'TAX-001' });

    // 2. Create Staff
    await Staff.bulkCreate([
      { storeId: 1, fullname: 'Nguyễn Văn Admin', role: 'Owner', phone: '0901234567', username: 'admin', hashedPassword: hashedPW, email: 'admin@huyitit.com' },
      { storeId: 1, fullname: 'Trần Thị Minh Anh', role: 'Staff', phone: '0902234567', username: 'minhanh', hashedPassword: hashedPW, email: 'minhanh@huyitit.com' }
    ]);

    // 3. Create Customer
    await Customer.bulkCreate([
      { fullname: 'Khách Hàng Vip', phone: '0999999999', email: 'vip@gmail.com', points: 1000 }
    ]);

    const attributes = {
      color: await Attribute.create({ name: 'Màu sắc' }),
      rom: await Attribute.create({ name: 'Dung lượng' }),
      ram: await Attribute.create({ name: 'RAM' }),
      size: await Attribute.create({ name: 'Kích thước' }),
      cap: await Attribute.create({ name: 'Công suất/Khối lượng' }),
      type: await Attribute.create({ name: 'Kiểu dáng' }),
      res: await Attribute.create({ name: 'Độ phân giải' }),
      panel: await Attribute.create({ name: 'Loại màn hình' }),
      material: await Attribute.create({ name: 'Chất liệu' })
    };

    const cats = await Category.bulkCreate([
      { name: 'Điện thoại' },
      { name: 'Tivi' },
      { name: 'Laptop' },
      { name: 'Tủ lạnh' },
      { name: 'Máy giặt' },
      { name: 'Gia dụng' },
      { name: 'Âm thanh' }
    ]);

    const createdVariants = [];
    const insertData = async (catId, name, vars) => {
      const product = await Product.create({ categoryId: catId, productName: name, brand: name.split(' ')[0], taxRate: 10, warrantyPeriod: 12 });
      for (const v of vars) {
        const variant = await Variant.create({
          productId: product.id,
          skuCode: v.sku,
          importPrice: v.price * 0.7,
          sellPrice: v.price,
          stockQuantity: v.qty || 50,
          imageUrl: v.img
        });
        createdVariants.push(variant);

        const values = [];
        Object.keys(attributes).forEach(key => {
          if (v[key]) values.push({ variantId: variant.id, attributeId: attributes[key].id, value: v[key] });
        });
        if (values.length > 0) await Variant_Attribute_Value.bulkCreate(values);
      }
    };

    const phoneData = [
      ['iPhone 15 Pro Max', [{ sku: 'IP15PM-256', color: 'Titan Tự Nhiên', rom: '256GB', ram: '8GB', price: 29990000, img: 'https://images.unsplash.com/photo-1696446701796-da61225697cc?w=600' }]],
      ['Galaxy S24 Ultra', [{ sku: 'S24U-256', color: 'Xám Titan', rom: '256GB', ram: '12GB', price: 26990000, img: 'https://images.unsplash.com/photo-1707241221132-7a8689ba488d?w=600' }]]
    ];
    for (const [name, vars] of phoneData) await insertData(cats[0].id, name, vars);

    const promo = await Promotion.create({
      promotionName: 'SIÊU SALE MÙA HÈ - GIẢM 15%',
      discountPercent: 15.00,
      startDate: sequelize.literal('NOW()'),
      endDate: sequelize.literal('DATE_ADD(NOW(), INTERVAL 1 MONTH)'),
      usageCount: 0
    });

    const promoVariants = [
      { promotionId: promo.id, variantId: createdVariants[0].id }
    ];
    await Promotion_Variant.bulkCreate(promoVariants);

    console.log('🛒 ĐANG TẠO ĐƠN HÀNG MẪU...');
    for (let i = 0; i < 3; i++) {
      const v = createdVariants[Math.floor(Math.random() * createdVariants.length)];
      const qty = 1;
      const subtotal = Number(v.sellPrice) * qty;
      const total = subtotal * 1.1; // with tax

      const order = await SaleOrder.create({
        staffId: 1,
        customerId: 1,
        subTotal: subtotal,
        discountAmount: 0,
        taxAmount: subtotal * 0.1,
        finalTotal: total,
        paymentMethod: 'Tiền mặt',
        refundAmount: 0
      });

      await SaleDetail.create({
        orderId: order.id,
        variantId: v.id,
        quantity: qty,
        unitPrice: v.sellPrice,
        totalDiscount: 0,
        lineTotal: subtotal,
        serialCode: 'SN-' + Math.random().toString(36).substring(7).toUpperCase()
      });
    }

    console.log('✨ SEEDING MYSQL HOÀN TẤT!');
    process.exit(0);
  } catch (err) {
    console.error('❌ LỖI HỆ THỐNG DỮ LIỆU:', err);
    process.exit(1);
  }
}

seed();

