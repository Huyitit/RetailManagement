const {
  sequelize, Profile, Staff, Customer, Supplier, Category,
  Product, Variant, Receipt, SaleOrder, ImportOrder,
  SaleDetail, ImportDetail, Promotion, Promotion_Variant,
  Attribute, Variant_Attribute_Value
} = require('./models');

async function seed() {
  try {
    console.log('🌌 KHỞI ĐỘNG CHIẾN DỊCH "SIÊU GALAXY DỮ LIỆU" (V16 - SQL LITERAL PROMO)...');

    await sequelize.query('EXEC sp_MSforeachtable "ALTER TABLE ? NOCHECK CONSTRAINT ALL"');
    await sequelize.query('EXEC sp_MSforeachtable "DELETE FROM ?"');

    const tables = [
      'Profile', 'Staff', 'Customer', 'Supplier', 'Category',
      'Product', 'Variant', 'Receipt', 'SaleOrder', 'ImportOrder',
      'SaleDetail', 'ImportDetail', 'Promotion', 'Promotion_Variant',
      'Attribute', 'Variant_Attribute_Value', 'WarrantyLog'
    ];
    for (const table of tables) {
      try { await sequelize.query(`DBCC CHECKIDENT ('${table}', RESEED, 0)`).catch(() => {}); } catch (e) {}
    }
    await sequelize.query('EXEC sp_MSforeachtable "ALTER TABLE ? CHECK CONSTRAINT ALL"');

    await Profile.bulkCreate([
      { fullName: 'Nguyễn Văn Admin', role: 'Owner', phoneNumber: '0901234567', gender: 'Nam' },
      { fullName: 'Trần Thị Minh Anh', role: 'Staff', phoneNumber: '0902234567', gender: 'Nữ' },
      { fullName: 'Khách Hàng Vip', role: 'Customer', phoneNumber: '0999999999', gender: 'Nữ' }
    ]);
    await Staff.bulkCreate([
      { profileId: 1, username: 'admin', password: '123', status: 'Active' },
      { profileId: 2, username: 'minhanh', password: '123', status: 'Active' }
    ]);

    const attributes = {
      color: await Attribute.create({ attributeName: 'Màu sắc' }),
      rom: await Attribute.create({ attributeName: 'Dung lượng' }),
      ram: await Attribute.create({ attributeName: 'RAM' }),
      size: await Attribute.create({ attributeName: 'Kích thước' }),
      cap: await Attribute.create({ attributeName: 'Công suất/Khối lượng' }),
      type: await Attribute.create({ attributeName: 'Kiểu dáng' }),
      res: await Attribute.create({ attributeName: 'Độ phân giải' }),
      panel: await Attribute.create({ attributeName: 'Loại màn hình' }),
      material: await Attribute.create({ attributeName: 'Chất liệu' })
    };

    const cats = await Category.bulkCreate([
      { categoryName: 'Điện thoại' },
      { categoryName: 'Tivi' },
      { categoryName: 'Laptop' },
      { categoryName: 'Tủ lạnh' },
      { categoryName: 'Máy giặt' },
      { categoryName: 'Gia dụng' },
      { categoryName: 'Âm thanh' }
    ]);

    const createdVariants = [];
    const insertData = async (catId, name, vars) => {
      const product = await Product.create({ categoryId: catId, productName: name, taxRate: 10, warrantyPeriod: 12 });
      for (const v of vars) {
        const variant = await Variant.create({
          productId: product.productId,
          SKU: v.sku,
          costPrice: v.price * 0.7,
          sellPrice: v.price,
          quantity: v.qty || 50,
          imageUrl: v.img
        });
        createdVariants.push(variant);

        const values = [];
        Object.keys(attributes).forEach(key => {
          if (v[key]) values.push({ variantId: variant.variantId, attributeId: attributes[key].attributeId, value: v[key] });
        });
        if (values.length > 0) await Variant_Attribute_Value.bulkCreate(values);
      }
    };

    const phoneData = [
      ['iPhone 15 Pro Max', [{ sku: 'IP15PM-256', color: 'Titan Tự Nhiên', rom: '256GB', ram: '8GB', price: 29990000, img: 'https://images.unsplash.com/photo-1696446701796-da61225697cc?w=600' }]],
      ['Galaxy S24 Ultra', [{ sku: 'S24U-256', color: 'Xám Titan', rom: '256GB', ram: '12GB', price: 26990000, img: 'https://images.unsplash.com/photo-1707241221132-7a8689ba488d?w=600' }]],
      ['Galaxy Z Fold5', [{ sku: 'Z-FOLD5', color: 'Kem', rom: '512GB', ram: '12GB', price: 32900000, img: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=600' }]],
      ['iPhone 14 Pro', [{ sku: 'IP14P-128', color: 'Tím Deep Purple', rom: '128GB', ram: '6GB', price: 23500000, img: 'https://images.unsplash.com/photo-1663499482523-1c0c1bae4ce1?w=600' }]],
      ['Xiaomi 14 Ultra', [{ sku: 'XI-14U', color: 'Trắng', rom: '512GB', ram: '16GB', price: 28900000, img: 'https://images.unsplash.com/photo-1616348436168-de43ad0db179?w=600' }]],
      ['Oppo Find N3 Flip', [{ sku: 'OP-N3', color: 'Vàng', rom: '256GB', ram: '12GB', price: 22900000, img: 'https://images.unsplash.com/photo-1556656793-062ff9878258?w=600' }]],
      ['Google Pixel 8 Pro', [{ sku: 'GG-P8P', color: 'Xanh Bay', rom: '128GB', ram: '12GB', price: 19500000, img: 'https://images.unsplash.com/photo-1605236453806-6ff36851218e?w=600' }]],
      ['Samsung Galaxy A55', [{ sku: 'SS-A55', color: 'Xanh Lơ', rom: '128GB', ram: '8GB', price: 9990000, img: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=600' }]],
      ['Redmi Note 13 Pro+', [{ sku: 'XI-RN13P', color: 'Đen', rom: '256GB', ram: '12GB', price: 9490000, img: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600' }]],
      ['Realme 12 Pro+', [{ sku: 'RM-12P', color: 'Xanh Blue', rom: '256GB', ram: '8GB', price: 11900000, img: 'https://images.unsplash.com/photo-1533228890422-038753a0678d?w=600' }]]
    ];
    for (const [name, vars] of phoneData) await insertData(cats[0].categoryId, name, vars);

    const tiviData = [
      ['Sony Bravia XR OLED A80L', [{ sku: 'SN-A80L-55', size: '55 INCH', res: '4K', panel: 'OLED', price: 34900000, img: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=600' }]],
      ['Samsung Neo QLED QN90C', [{ sku: 'SS-QN90-75', size: '75 INCH', res: '4K', panel: 'Neo QLED', price: 55900000, img: 'https://images.unsplash.com/photo-1552284043-199468a221f7?w=600' }]],
      ['LG C3 OLED Evo', [{ sku: 'LG-C3-55', size: '55 INCH', res: '4K', panel: 'OLED', price: 36500000, img: 'https://images.unsplash.com/photo-1509281373149-e957c6296406?w=600' }]],
      ['TCL Mini LED C845', [{ sku: 'TCL-C845-65', size: '65 INCH', res: '4K', panel: 'Mini LED', price: 23900000, img: 'https://images.unsplash.com/photo-1461151304267-38535e770d79?w=600' }]],
      ['Xiaomi TV A Pro', [{ sku: 'XI-TV-55', size: '55 INCH', res: '4K', panel: 'LED', price: 9500000, img: 'https://images.unsplash.com/photo-1567690187548-f07b1d7bf5a9?w=600' }]],
      ['Samsung Crystal UHD', [{ sku: 'SS-UHD-65', size: '65 INCH', res: '4K', panel: 'UHD', price: 16900000, img: 'https://images.unsplash.com/photo-1533236897111-3e94666b2dda?w=600' }]],
      ['Sony LED X80L', [{ sku: 'SN-X80L-50', size: '50 INCH', res: '4K', panel: 'LED', price: 14500000, img: 'https://images.unsplash.com/photo-1495563973552-4c4ad8394535?w=600' }]],
      ['LG Nanocell 55', [{ sku: 'LG-NANO-55', size: '55 INCH', res: '4K', panel: 'Nanocell', price: 14900000, img: 'https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=600' }]],
      ['Xiaomi TV Max 86', [{ sku: 'XI-MAX-86', size: '86 INCH', res: '4K', panel: 'LED', price: 29900000, img: 'https://images.unsplash.com/photo-1509281373149-e957c6296406?w=600' }]],
      ['Casper 4K Google TV', [{ sku: 'CAS-TV-50', size: '50 INCH', res: '4K', panel: 'LED', price: 7490000, img: 'https://images.unsplash.com/photo-1567690187548-f07b1d7bf5a9?w=600' }]]
    ];
    for (const [name, vars] of tiviData) await insertData(cats[1].categoryId, name, vars);

    const laptopData = [
      ['MacBook Pro M3 Pro', [{ sku: 'MBP-M3', color: 'Space Black', ram: '18GB', rom: '512GB', size: '14.2 INCH', price: 49900000, img: 'https://images.unsplash.com/photo-1517336714460-4c50d9178358?w=600' }]],
      ['ASUS TUF Gaming F15', [{ sku: 'AS-TUF', color: 'Đen nhám', ram: '16GB', rom: '512GB', size: '15.6 INCH', price: 21900000, img: 'https://images.unsplash.com/photo-1544006659-f0b21f04cb1d?w=600' }]],
      ['Dell XPS 13 Plus', [{ sku: 'DELL-XPS', color: 'Bạc', ram: '16GB', rom: '512GB', size: '13.4 INCH', price: 42500000, img: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=600' }]],
      ['HP Pavilion 15', [{ sku: 'HP-PAV', color: 'Vàng Gold', ram: '8GB', rom: '512GB', size: '15.6 INCH', price: 14500000, img: 'https://images.unsplash.com/photo-1589561084283-930aa7b1ce50?w=600' }]],
      ['Lenovo Legion Slim 5', [{ sku: 'LEN-LEG', color: 'Xám', ram: '16GB', rom: '512GB', size: '16 INCH', price: 32900000, img: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=600' }]],
      ['Acer Nitro 5 Tiger', [{ sku: 'ACER-N5', color: 'Đen', ram: '16GB', rom: '512GB', size: '15.6 INCH', price: 21500000, img: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=600' }]],
      ['MSI Katana 15', [{ sku: 'MSI-K15', color: 'Đen', ram: '16GB', rom: '512GB', size: '15.6 INCH', price: 25900000, img: 'https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=600' }]],
      ['MacBook Air M2', [{ sku: 'MBA-M2', color: 'Midnight', ram: '8GB', rom: '256GB', size: '13.6 INCH', price: 26500000, img: 'https://images.unsplash.com/photo-1611186871348-b1ec696e5237?w=600' }]],
      ['ASUS Zenbook 14', [{ sku: 'AS-ZEN', color: 'Xanh Blue', ram: '16GB', rom: '512GB', size: '14 INCH', price: 23900000, img: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600' }]],
      ['LG Gram 16', [{ sku: 'LG-GRAM', color: 'Trắng', ram: '16GB', rom: '512GB', size: '16 INCH', price: 35900000, img: 'https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=600' }]]
    ];
    for (const [name, vars] of laptopData) await insertData(cats[2].categoryId, name, vars);

    const refData = [
      ['Samsung Bespoke 648L', [{ sku: 'SS-BS-648', color: 'Trắng/Xanh', cap: '648 LÍT', type: 'Side by Side', price: 38900000, img: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=600' }]],
      ['LG Inverter 635L', [{ sku: 'LG-635-SL', color: 'Bạc', cap: '635 LÍT', type: 'Side by Side', price: 24500000, img: 'https://images.unsplash.com/photo-1571175432244-93444434229b?w=600' }]],
      ['Panasonic Prime+ 540L', [{ sku: 'PAN-540', color: 'Đen Gương', cap: '540 LÍT', type: 'Multi Door', price: 32500000, img: 'https://plus.unsplash.com/premium_photo-1661765584555-081033480076?w=600' }]],
      ['Hitachi Inverter 450L', [{ sku: 'HIT-450', color: 'Trắng', cap: '450 LÍT', type: '2 Cánh', price: 17900000, img: 'https://images.unsplash.com/photo-1588854337236-6889d631faa8?w=600' }]],
      ['Toshiba Inverter 320L', [{ sku: 'TOS-320', color: 'Bạc', cap: '320 LÍT', type: '2 Cánh', price: 9500000, img: 'https://images.unsplash.com/photo-1563200141-8664a7815f9b?w=600' }]],
      ['Sharp 4 Cánh 556L', [{ sku: 'SH-556', color: 'Đen', cap: '556 LÍT', type: 'Multi Door', price: 19900000, img: 'https://images.unsplash.com/photo-1620063231122-17ca3561a096?w=600' }]],
      ['Aqua Inverter 541L', [{ sku: 'AQ-541', color: 'Đen Gương', cap: '541 LÍT', type: 'Side by Side', price: 16500000, img: 'https://images.unsplash.com/photo-1512411964260-2396e987c65d?w=600' }]],
      ['Beko Inverter 323L', [{ sku: 'BE-323', color: 'Xám', cap: '323 LÍT', type: '2 Cánh', price: 8900000, img: 'https://images.unsplash.com/photo-1520641051515-780c10803657?w=600' }]],
      ['Whirlpool 594L', [{ sku: 'WHI-594', color: 'Inox', cap: '594 LÍT', type: 'French Door', price: 27900000, img: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=600' }]]
    ];
    for (const [name, vars] of refData) await insertData(cats[3].categoryId, name, vars);

    const washData = [
      ['LG AI DD 10kg', [{ sku: 'LG-W10', color: 'Xám', cap: '10 KG', type: 'Cửa trước', price: 10900000, img: 'https://images.unsplash.com/photo-1626806819282-2c1dc61a0e05?w=600' }]],
      ['Samsung Ecobubble 9kg', [{ sku: 'SS-W9', color: 'Trắng', cap: '9 KG', type: 'Cửa trước', price: 8500000, img: 'https://images.unsplash.com/photo-1517677208171-0bc6725a3e60?w=600' }]],
      ['Electrolux Inverter 11kg', [{ sku: 'EL-W11', color: 'Đen', cap: '11 KG', type: 'Cửa trước', price: 15500000, img: 'https://images.unsplash.com/photo-1545173168-9f1947eebb7f?w=600' }]],
      ['Panasonic 9.5kg', [{ sku: 'PAN-W95', color: 'Bạc', cap: '9.5 KG', type: 'Cửa trên', price: 6900000, img: 'https://images.unsplash.com/photo-1610557892470-55d9e80c0bce?w=600' }]],
      ['Toshiba Inverter 8.5kg', [{ sku: 'TOS-W85', color: 'Trắng', cap: '8.5 KG', type: 'Cửa trên', price: 5400000, img: 'https://images.unsplash.com/photo-1567202555103-4775a3fb13bb?w=600' }]],
      ['Aqua Inverter 10.5kg', [{ sku: 'AQ-W105', color: 'Bạc', cap: '10.5 KG', type: 'Cửa trước', price: 8900000, img: 'https://images.unsplash.com/photo-1582735689369-4fe89db7114c?w=600' }]],
      ['Beko Inverter 9kg', [{ sku: 'BEKO-W9', color: 'Xám', cap: '9 KG', type: 'Cửa trước', price: 7200000, img: 'https://images.unsplash.com/photo-1521903062400-b80a2bb0cd35?w=600' }]],
      ['Whirlpool 10.5kg', [{ sku: 'WHI-W10', color: 'Trắng', cap: '10.5 KG', type: 'Cửa trước', price: 13500000, img: 'https://images.unsplash.com/photo-1521903062400-b80a2bb0cd35?w=600' }]],
      ['Samsung Washer & Dryer 12kg', [{ sku: 'SS-WD12', color: 'Đen', cap: '12 KG', type: 'Giặt sấy', price: 18900000, img: 'https://images.unsplash.com/photo-1517677208171-0bc6725a3e60?w=600' }]]
    ];
    for (const [name, vars] of washData) await insertData(cats[4].categoryId, name, vars);

    const giaDungData = [
      ['Nồi chiên Philips 6L', [{ sku: 'PH-AF-6', color: 'Đen', cap: '6 LÍT', type: 'Điện tử', price: 3850000, img: 'https://images.unsplash.com/photo-1626074353765-517a681e40be?w=600' }]],
      ['Robot hút bụi Roborock S8', [{ sku: 'RR-S8', color: 'Đen', type: 'Robot tự động', price: 15900000, img: 'https://images.unsplash.com/photo-1518133910546-b6c2fb7d79e3?w=600' }]],
      ['Máy lọc nước Karofi', [{ sku: 'KA-W10', cap: '10 LÕI', type: 'Tủ đứng', price: 6200000, img: 'https://images.unsplash.com/photo-1517646287270-a5a9ca602e5c?w=600' }]],
      ['Máy xay sinh tố Philips', [{ sku: 'PH-BL-S', color: 'Trắng', cap: '1.5 LÍT', price: 1650000, img: 'https://images.unsplash.com/photo-1570197788417-0e82375c9391?w=600' }]],
      ['Lò vi sóng Sharp 23L', [{ sku: 'SH-MW-23', color: 'Bạc', cap: '23 LÍT', price: 2850000, img: 'https://images.unsplash.com/photo-1585659823861-43209f476b25?w=600' }]],
      ['Quạt đứng Mitsubishi', [{ sku: 'MIT-LV', color: 'Xám', type: 'Có điều khiển', price: 1950000, img: 'https://images.unsplash.com/photo-1565151443833-29bf2ba5dd8d?w=600' }]],
      ['Nồi cơm điện Cuckoo', [{ sku: 'CK-RC-18', color: 'Đỏ', cap: '1.8 LÍT', type: 'Cao tần', price: 6500000, img: 'https://images.unsplash.com/photo-1544233726-9f1d2b27be8b?w=600' }]],
      ['Bếp từ Sunhouse', [{ sku: 'SH-IND-2', color: 'Đen', type: 'Bếp đôi', price: 4200000, img: 'https://images.unsplash.com/photo-1626200419199-391ae4be7a41?w=600' }]],
      ['Máy lọc không khí Xiaomi 4 Pro', [{ sku: 'XI-AP-4P', color: 'Trắng', cap: '60m2', price: 4500000, img: 'https://images.unsplash.com/photo-1585771724684-252a995af834?w=600' }]],
      ['Ấm siêu tốc Bluestone', [{ sku: 'BL-KET-1', color: 'Inox', cap: '1.7 LÍT', price: 650000, img: 'https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?w=600' }]],
      ['Máy ép chậm Hurom', [{ sku: 'HU-H200', color: 'Đỏ', type: 'Máy ép chậm', price: 9900000, img: 'https://images.unsplash.com/photo-1610970881699-44a5587cabec?w=600' }]],
      ['Máy xay đa năng Moulinex', [{ sku: 'MO-BL', color: 'Trắng', cap: '2 LÍT', price: 2450000, img: 'https://images.unsplash.com/photo-1570197788417-0e82375c9391?w=600' }]]
    ];
    for (const [name, vars] of giaDungData) await insertData(cats[5].categoryId, name, vars);

    await insertData(cats[6].categoryId, 'Marshall Stanmore III', [{ sku: 'MS-ST3', color: 'Nâu', price: 9200000, img: 'https://images.unsplash.com/photo-1545454675-3531bdf9915e?w=600' }]);

    const promo = await Promotion.create({
      promotionName: 'SIÊU SALE MÙA HÈ - GIẢM 15%',
      discountPercent: 15.00,
      startDate: sequelize.literal('GETDATE()'),
      endDate: sequelize.literal('DATEADD(month, 1, GETDATE())'),
      usageCount: 0
    });

    const promoVariants = [
      { promotionId: promo.promotionId, variantId: createdVariants[0].variantId },
      { promotionId: promo.promotionId, variantId: createdVariants[10].variantId },
      { promotionId: promo.promotionId, variantId: createdVariants[20].variantId }
    ];
    await Promotion_Variant.bulkCreate(promoVariants);

    console.log('🛒 ĐANG TẠO ĐƠN HÀNG MẪU...');
    for (let i = 0; i < 5; i++) {
      const v = createdVariants[Math.floor(Math.random() * createdVariants.length)];
      const qty = 1;
      const subtotal = Number(v.sellPrice) * qty;
      const tax = subtotal * 0.1;
      const total = subtotal + tax;

      const receipt = await Receipt.create({
        staffId: 1,
        totalPrice: total,
        type: 'SALE',
        orderAt: sequelize.literal('GETDATE()')
      });

      await SaleOrder.create({
        receiptId: receipt.receiptId,
        paymentMethod: 'Tiền mặt',
        saleStatus: 'Completed',
        amountReceived: total,
        amountChange: 0
      });

      await SaleDetail.create({
        receiptId: receipt.receiptId,
        variantId: v.variantId,
        quantity: qty,
        unitPrice: v.sellPrice,
        discountAmount: 0,
        finalPrice: v.sellPrice
      });
    }

    console.log('✨ CHIẾN DỊCH "SIÊU GALAXY DỮ LIỆU" + PROMOTION + SAMPLE ORDERS HOÀN TẤT!');
    process.exit(0);
  } catch (err) {
    console.error('❌ LỖI HỆ THỐNG DỮ LIỆU:', err);
    process.exit(1);
  }
}

seed();
