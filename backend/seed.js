const {
  sequelize, Store, Staff, Customer, Supplier, Category,
  Product, Variant, Order, OrderDetail, Promotion, PromotionVariant,
  Attribute, VariantAttribute
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
        if (values.length > 0) await VariantAttribute.bulkCreate(values);
      }
    };

    const phoneData = [
      ['iPhone 15 Pro Max', [{ sku: 'IP15PM-256', color: 'Titan Tự Nhiên', rom: '256GB', ram: '8GB', price: 29990000, img: 'http://localhost:5001/uploads/iphone15pm.png' }]],
      ['Galaxy S24 Ultra', [{ sku: 'S24U-256', color: 'Xám Titan', rom: '256GB', ram: '12GB', price: 26990000, img: 'http://localhost:5001/uploads/s24u.png' }]],
      ['Galaxy Z Fold5', [{ sku: 'Z-FOLD5', color: 'Kem', rom: '512GB', ram: '12GB', price: 32900000, img: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=600' }]],
      ['iPhone 14 Pro', [{ sku: 'IP14P-128', color: 'Tím Deep Purple', rom: '128GB', ram: '6GB', price: 23500000, img: 'https://images.unsplash.com/photo-1663499482523-1c0c1bae4ce1?w=600' }]],
      ['Xiaomi 14 Ultra', [{ sku: 'XI-14U', color: 'Trắng', rom: '512GB', ram: '16GB', price: 28900000, img: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600' }]],
      ['Oppo Find N3 Flip', [{ sku: 'OP-N3', color: 'Vàng', rom: '256GB', ram: '12GB', price: 22900000, img: 'http://localhost:5001/uploads/oppon3flip.png' }]],
      ['Google Pixel 8 Pro', [{ sku: 'GG-P8P', color: 'Xanh Bay', rom: '128GB', ram: '12GB', price: 19500000, img: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=600' }]],
      ['Samsung Galaxy A55', [{ sku: 'SS-A55', color: 'Xanh Lơ', rom: '128GB', ram: '8GB', price: 9990000, img: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=600' }]],
      ['Redmi Note 13 Pro+', [{ sku: 'XI-RN13P', color: 'Đen', rom: '256GB', ram: '12GB', price: 9490000, img: 'http://localhost:5001/uploads/redmi13p.png' }]],
      ['Realme 12 Pro+', [{ sku: 'RM-12P', color: 'Xanh Blue', rom: '256GB', ram: '8GB', price: 11900000, img: 'http://localhost:5001/uploads/realme12p.png' }]]
    ];
    for (const [name, vars] of phoneData) await insertData(cats[0].id, name, vars);

    const tvData = [
      ['Sony Bravia XR OLED A80L', [{ sku: 'SN-A80L-55', size: '55 INCH', res: '4K', panel: 'OLED', price: 34900000, img: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=600' }]],
      ['Samsung Neo QLED QN90C', [{ sku: 'SS-QN90-75', size: '75 INCH', res: '4K', panel: 'Neo QLED', price: 55900000, img: 'https://images.unsplash.com/photo-1552284043-199468a221f7?w=600' }]],
      ['LG C3 OLED Evo', [{ sku: 'LG-C3-55', size: '55 INCH', res: '4K', panel: 'OLED', price: 36500000, img: 'https://images.unsplash.com/photo-1593784991095-a205039470b6?w=600' }]],
      ['TCL Mini LED C845', [{ sku: 'TCL-C845-65', size: '65 INCH', res: '4K', panel: 'Mini LED', price: 23900000, img: 'https://images.unsplash.com/photo-1461151304267-38535e770d79?w=600' }]]
    ];
    for (const [name, vars] of tvData) await insertData(cats[1].id, name, vars);

    const washerData = [
      ['LG AI DD 10kg', [{ sku: 'LG-W10', color: 'Xám', cap: '10 KG', type: 'Cửa trước', price: 10900000, img: 'http://localhost:5001/uploads/lg_washer_10kg.png' }]],
      ['Samsung Ecobubble 9kg', [{ sku: 'SS-W9', color: 'Trắng', cap: '9 KG', type: 'Cửa trước', price: 8500000, img: 'http://localhost:5001/uploads/samsung_9kg.png' }]],
      ['Electrolux Inverter 11kg', [{ sku: 'EL-W11', color: 'Đen', cap: '11 KG', type: 'Cửa trước', price: 15500000, img: 'http://localhost:5001/uploads/electrolux_11kg.png' }]],
      ['Panasonic 9.5kg', [{ sku: 'PAN-W95', color: 'Bạc', cap: '9.5 KG', type: 'Cửa trên', price: 6900000, img: 'http://localhost:5001/uploads/panasonic_95kg.png' }]],
      ['Toshiba Inverter 8.5kg', [{ sku: 'TOS-W85', color: 'Trắng', cap: '8.5 KG', type: 'Cửa trên', price: 5400000, img: 'http://localhost:5001/uploads/toshiba_85kg.png' }]],
      ['Aqua Inverter 10.5kg', [{ sku: 'AQ-W105', color: 'Bạc', cap: '10.5 KG', type: 'Cửa trước', price: 8900000, img: 'http://localhost:5001/uploads/aqua_105kg.png' }]],
      ['Beko Inverter 9kg', [{ sku: 'BEKO-W9', color: 'Xám', cap: '9 KG', type: 'Cửa trước', price: 7200000, img: 'http://localhost:5001/uploads/beko_9kg.png' }]],
      ['Whirlpool 10.5kg', [{ sku: 'WHI-W10', color: 'Trắng', cap: '10.5 KG', type: 'Cửa trước', price: 13500000, img: 'http://localhost:5001/uploads/whirlpool_105kg.png' }]],
      ['Samsung Washer & Dryer 12kg', [{ sku: 'SS-WD12', color: 'Đen', cap: '12 KG', type: 'Giặt sấy', price: 18900000, img: 'http://localhost:5001/uploads/samsung_wd_12kg.png' }]]
    ];
    for (const [name, vars] of washerData) await insertData(cats[4].id, name, vars);

    const laptopData = [
      ['MacBook Pro M3 Pro', [{ sku: 'MBP-M3', color: 'Space Black', rom: '512GB', ram: '18GB', size: '14.2 INCH', price: 49900000, img: 'http://localhost:5001/uploads/mbp_m3.jpg' }]],
      ['ASUS TUF Gaming F15', [{ sku: 'AS-TUF', color: 'Đen nhám', rom: '512GB', ram: '16GB', size: '15.6 INCH', price: 21900000, img: 'http://localhost:5001/uploads/asus_tuf.jpg' }]],
      ['Dell XPS 13 Plus', [{ sku: 'DELL-XPS', color: 'Bạc', rom: '512GB', ram: '16GB', size: '13.4 INCH', price: 42500000, img: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=600' }]],
      ['HP Pavilion 15', [{ sku: 'HP-PAV', color: 'Vàng Gold', rom: '512GB', ram: '8GB', size: '15.6 INCH', price: 14500000, img: 'https://images.unsplash.com/photo-1589561084283-930aa7b1ce50?w=600' }]],
      ['Lenovo Legion Slim 5', [{ sku: 'LEN-LEG', color: 'Xám', rom: '512GB', ram: '16GB', size: '16 INCH', price: 32900000, img: 'http://localhost:5001/uploads/legion_slim_5.jpg' }]],
      ['Acer Nitro 5 Tiger', [{ sku: 'ACER-N5', color: 'Đen', rom: '512GB', ram: '16GB', size: '15.6 INCH', price: 21500000, img: 'http://localhost:5001/uploads/nitro_5.jpg' }]],
      ['MSI Katana 15', [{ sku: 'MSI-K15', color: 'Đen', rom: '512GB', ram: '16GB', size: '15.6 INCH', price: 25900000, img: 'http://localhost:5001/uploads/msi_katana.jpg' }]],
      ['MacBook Air M2', [{ sku: 'MBA-M2', color: 'Midnight', rom: '256GB', ram: '8GB', size: '13.6 INCH', price: 26500000, img: 'http://localhost:5001/uploads/mba_m2.jpg' }]],
      ['ASUS Zenbook 14', [{ sku: 'AS-ZEN', color: 'Xanh Blue', rom: '512GB', ram: '16GB', size: '14 INCH', price: 23900000, img: 'http://localhost:5001/uploads/zenbook_14.jpg' }]],
      ['LG Gram 16', [{ sku: 'LG-GRAM', color: 'Trắng', rom: '512GB', ram: '16GB', size: '16 INCH', price: 35900000, img: 'http://localhost:5001/uploads/lg_gram.jpg' }]]
    ];
    for (const [name, vars] of laptopData) await insertData(cats[2].id, name, vars);

    const refrigeratorData = [
      ['Samsung Bespoke 648L', [{ sku: 'SS-BS-648', color: 'Trắng/Xanh', cap: '648 LÍT', type: 'Side by Side', price: 38900000, img: 'http://localhost:5001/uploads/samsung_bespoke_648l.png' }]],
      ['LG Inverter 635L', [{ sku: 'LG-635-SL', color: 'Bạc', cap: '635 LÍT', type: 'Side by Side', price: 24500000, img: 'http://localhost:5001/uploads/lg_635l.png' }]],
      ['Panasonic Prime+ 540L', [{ sku: 'PAN-540', color: 'Đen Gương', cap: '540 LÍT', type: 'Multi Door', price: 32500000, img: 'http://localhost:5001/uploads/panasonic_540l.png' }]],
      ['Hitachi Inverter 450L', [{ sku: 'HIT-450', color: 'Trắng', cap: '450 LÍT', type: '2 Cánh', price: 17900000, img: 'http://localhost:5001/uploads/hitachi_450l.png' }]],
      ['Toshiba Inverter 320L', [{ sku: 'TOS-320', color: 'Bạc', cap: '320 LÍT', type: '2 Cánh', price: 9500000, img: 'http://localhost:5001/uploads/toshiba_320l.png' }]],
      ['Sharp 4 Cánh 556L', [{ sku: 'SH-556', color: 'Đen', cap: '556 LÍT', type: 'Multi Door', price: 19900000, img: 'http://localhost:5001/uploads/sharp_556l.png' }]],
      ['Aqua Inverter 541L', [{ sku: 'AQ-541', color: 'Đen Gương', cap: '541 LÍT', type: 'Side by Side', price: 16500000, img: 'http://localhost:5001/uploads/aqua_541l.png' }]],
      ['Beko Inverter 323L', [{ sku: 'BE-323', color: 'Xám', cap: '323 LÍT', type: '2 Cánh', price: 8900000, img: 'http://localhost:5001/uploads/beko_323l.png' }]],
      ['Whirlpool 594L', [{ sku: 'WHI-594', color: 'Inox', cap: '594 LÍT', type: 'French Door', price: 27900000, img: 'http://localhost:5001/uploads/whirlpool_594l.png' }]]
    ];
    for (const [name, vars] of refrigeratorData) await insertData(cats[3].id, name, vars);

    const giaDungData = [
      ['Nồi chiên Philips 6L', [{ sku: 'PH-AF-6', color: 'Đen', cap: '6 Lít', type: 'Điện tử', price: 3850000, img: 'http://localhost:5001/uploads/philips_af.png' }]],
      ['Robot hút bụi Roborock S8', [{ sku: 'RR-S8', color: 'Đen', type: 'Robot tự động', price: 15900000, img: 'http://localhost:5001/uploads/roborock_s8.png' }]],
      ['Máy lọc nước Karofi', [{ sku: 'KA-W10', cap: '10 Lõi', type: 'Tủ đứng', price: 6200000, img: 'http://localhost:5001/uploads/karofi_water.png' }]],
      ['Máy xay sinh tố Philips', [{ sku: 'PH-BL-S', color: 'Trắng', cap: '1.5 Lít', price: 1650000, img: 'http://localhost:5001/uploads/philips_bl.png' }]],
      ['Lò vi sóng Sharp 23L', [{ sku: 'SH-MW-23', color: 'Bạc', cap: '23 Lít', price: 2850000, img: 'http://localhost:5001/uploads/sharp_mw.png' }]],
      ['Quạt đứng Mitsubishi', [{ sku: 'MIT-LV', color: 'Xám', type: 'Có điều khiển', price: 1950000, img: 'http://localhost:5001/uploads/mitsubishi_fan.png' }]],
      ['Nồi cơm điện Cuckoo', [{ sku: 'CK-RC-18', color: 'Đỏ', cap: '1.8 Lít', type: 'Cao tần', price: 6500000, img: 'http://localhost:5001/uploads/cuckoo_rc.png' }]],
      ['Bếp từ Sunhouse', [{ sku: 'SH-IND-2', color: 'Đen', type: 'Bếp đôi', price: 4200000, img: 'http://localhost:5001/uploads/sunhouse_cooker.png' }]],
      ['Máy lọc không khí Xiaomi 4 Pro', [{ sku: 'XI-AP-4P', color: 'Trắng', cap: '60m2', price: 4500000, img: 'http://localhost:5001/uploads/xiaomi_ap.png' }]],
      ['Ấm siêu tốc Bluestone', [{ sku: 'BL-KET-1', color: 'Inox', cap: '1.7 Lít', price: 650000, img: 'http://localhost:5001/uploads/bluestone_kettle.png' }]],
      ['Máy ép chậm Hurom', [{ sku: 'HU-H200', color: 'Đỏ', type: 'Máy ép chậm', price: 9900000, img: 'http://localhost:5001/uploads/hurom_sj.png' }]],
      ['Máy xay đa năng Moulinex', [{ sku: 'MO-BL', color: 'Trắng', cap: '2 Lít', price: 2450000, img: 'http://localhost:5001/uploads/moulinex_bl.png' }]]
    ];
    for (const [name, vars] of giaDungData) await insertData(cats[5].id, name, vars);

    const promo = await Promotion.create({
      promotionName: 'SIÊU SALE MÙA HÈ - GIẢM 15%',
      discountPercent: 15.00,
      startDate: sequelize.literal('NOW()'),
      endDate: sequelize.literal('DATE_ADD(NOW(), INTERVAL 1 MONTH)'),
      usageCount: 0
    });

    const promoVariants = [
      { promotionId: promo.id, variantId: createdVariants[0].id },
      { promotionId: promo.id, variantId: createdVariants[createdVariants.length - 1].id }
    ];
    await PromotionVariant.bulkCreate(promoVariants);

    console.log('🛒 ĐANG TẠO ĐƠN HÀNG MẪU...');
    for (let i = 0; i < 5; i++) {
      const v = createdVariants[Math.floor(Math.random() * createdVariants.length)];
      const qty = 1;
      const subtotal = Number(v.sellPrice) * qty;
      const total = subtotal * 1.1; 

      const order = await Order.create({
        staffId: 1,
        customerId: 1,
        subTotal: subtotal,
        discountAmount: 0,
        taxAmount: subtotal * 0.1,
        finalTotal: total,
        paymentMethod: 'Tiền mặt',
        refundAmount: 0
      });

      await OrderDetail.create({
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
