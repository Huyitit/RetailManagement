const sequelize = require('../configs/db');
const Store = require('./Store');
const Staff = require('./Staff');
const Customer = require('./Customer');
const Supplier = require('./Supplier');
const Category = require('./Category');
const Product = require('./Product');
const Variant = require('./Variant');
const SaleOrder = require('./SaleOrder');
const ImportOrder = require('./ImportOrder');
const SaleDetail = require('./SaleDetail');
const ImportDetail = require('./ImportDetail');
const Promotion = require('./Promotion');
const Promotion_Variant = require('./Promotion_Variant');
const WarrantyLog = require('./WarrantyLog');
const Attribute = require('./Attribute');
const Variant_Attribute_Value = require('./Variant_Attribute_Value');

Store.hasMany(Staff, { foreignKey: 'storeId' });
Staff.belongsTo(Store, { foreignKey: 'storeId' });

Category.hasMany(Product, { foreignKey: 'categoryId' });
Product.belongsTo(Category, { foreignKey: 'categoryId' });

Product.hasMany(Variant, { foreignKey: 'productId' });
Variant.belongsTo(Product, { foreignKey: 'productId' });

Staff.hasMany(SaleOrder, { foreignKey: 'staffId' });
SaleOrder.belongsTo(Staff, { foreignKey: 'staffId' });

Customer.hasMany(SaleOrder, { foreignKey: 'customerId' });
SaleOrder.belongsTo(Customer, { foreignKey: 'customerId' });

SaleOrder.hasMany(SaleDetail, { foreignKey: 'orderId' });
SaleDetail.belongsTo(SaleOrder, { foreignKey: 'orderId' });

Variant.hasMany(SaleDetail, { foreignKey: 'variantId' });
SaleDetail.belongsTo(Variant, { foreignKey: 'variantId' });

Supplier.hasMany(ImportOrder, { foreignKey: 'supplierId' });
ImportOrder.belongsTo(Supplier, { foreignKey: 'supplierId' });

ImportOrder.hasMany(ImportDetail, { foreignKey: 'importReceiptId' });
ImportDetail.belongsTo(ImportOrder, { foreignKey: 'importReceiptId' });

Variant.hasMany(ImportDetail, { foreignKey: 'variantId' });
ImportDetail.belongsTo(Variant, { foreignKey: 'variantId' });

Supplier.hasMany(ImportDetail, { foreignKey: 'supplierId' });
ImportDetail.belongsTo(Supplier, { foreignKey: 'supplierId' });

Promotion.belongsToMany(Variant, { through: Promotion_Variant, foreignKey: 'promotionId' });
Variant.belongsToMany(Promotion, { through: Promotion_Variant, foreignKey: 'variantId' });

SaleDetail.hasMany(WarrantyLog, { foreignKey: 'orderDetailId' });
WarrantyLog.belongsTo(SaleDetail, { foreignKey: 'orderDetailId' });

Staff.hasMany(WarrantyLog, { foreignKey: 'staffId' });
WarrantyLog.belongsTo(Staff, { foreignKey: 'staffId' });

Variant.hasMany(Variant_Attribute_Value, { foreignKey: 'variantId', as: 'attributeValues' });
Variant_Attribute_Value.belongsTo(Variant, { foreignKey: 'variantId' });

Attribute.hasMany(Variant_Attribute_Value, { foreignKey: 'attributeId' });
Variant_Attribute_Value.belongsTo(Attribute, { foreignKey: 'attributeId', as: 'attribute' });

module.exports = {
  sequelize,
  Store,
  Staff,
  Customer,
  Supplier,
  Category,
  Product,
  Variant,
  SaleOrder,
  ImportOrder,
  SaleDetail,
  ImportDetail,
  Promotion,
  Promotion_Variant,
  WarrantyLog,
  Attribute,
  Variant_Attribute_Value
};

