const sequelize = require('../configs/db');
const Profile = require('./Profile');
const Staff = require('./Staff');
const Customer = require('./Customer');
const Supplier = require('./Supplier');
const Category = require('./Category');
const Product = require('./Product');
const Variant = require('./Variant');
const Receipt = require('./Receipt');
const SaleOrder = require('./SaleOrder');
const ImportOrder = require('./ImportOrder');
const SaleDetail = require('./SaleDetail');
const ImportDetail = require('./ImportDetail');
const Promotion = require('./Promotion');
const Promotion_Variant = require('./Promotion_Variant');
const WarrantyLog = require('./WarrantyLog');
const Attribute = require('./Attribute');
const Variant_Attribute_Value = require('./Variant_Attribute_Value');

Profile.hasOne(Staff, { foreignKey: 'profileId' });
Staff.belongsTo(Profile, { foreignKey: 'profileId' });

Profile.hasOne(Customer, { foreignKey: 'profileId' });
Customer.belongsTo(Profile, { foreignKey: 'profileId' });

Profile.hasOne(Supplier, { foreignKey: 'profileId' });
Supplier.belongsTo(Profile, { foreignKey: 'profileId' });

Category.hasMany(Product, { foreignKey: 'categoryId' });
Product.belongsTo(Category, { foreignKey: 'categoryId' });

Product.hasMany(Variant, { foreignKey: 'productId' });
Variant.belongsTo(Product, { foreignKey: 'productId' });

Staff.hasMany(Receipt, { foreignKey: 'staffId' });
Receipt.belongsTo(Staff, { foreignKey: 'staffId' });

Receipt.hasOne(SaleOrder, { foreignKey: 'receiptId' });
SaleOrder.belongsTo(Receipt, { foreignKey: 'receiptId' });

Receipt.hasOne(ImportOrder, { foreignKey: 'receiptId' });
ImportOrder.belongsTo(Receipt, { foreignKey: 'receiptId' });

Customer.hasMany(SaleOrder, { foreignKey: 'customerId' });
SaleOrder.belongsTo(Customer, { foreignKey: 'customerId' });

Supplier.hasMany(ImportOrder, { foreignKey: 'supplierId' });
ImportOrder.belongsTo(Supplier, { foreignKey: 'supplierId' });

SaleOrder.hasMany(SaleDetail, { foreignKey: 'receiptId' });
SaleDetail.belongsTo(SaleOrder, { foreignKey: 'receiptId' });

ImportOrder.hasMany(ImportDetail, { foreignKey: 'receiptId' });
ImportDetail.belongsTo(ImportOrder, { foreignKey: 'receiptId' });

Variant.hasMany(SaleDetail, { foreignKey: 'variantId' });
SaleDetail.belongsTo(Variant, { foreignKey: 'variantId' });

Variant.hasMany(ImportDetail, { foreignKey: 'variantId' });
ImportDetail.belongsTo(Variant, { foreignKey: 'variantId' });

Promotion.belongsToMany(Variant, { through: Promotion_Variant, foreignKey: 'promotionId' });
Variant.belongsToMany(Promotion, { through: Promotion_Variant, foreignKey: 'variantId' });

WarrantyLog.belongsTo(SaleOrder, { foreignKey: 'receiptId' });
SaleOrder.hasMany(WarrantyLog, { foreignKey: 'receiptId' });
WarrantyLog.belongsTo(Staff, { foreignKey: 'staffId' });
Staff.hasMany(WarrantyLog, { foreignKey: 'staffId' });

Variant.hasMany(Variant_Attribute_Value, { foreignKey: 'variantId', as: 'attributeValues' });
Variant_Attribute_Value.belongsTo(Variant, { foreignKey: 'variantId' });
Attribute.hasMany(Variant_Attribute_Value, { foreignKey: 'attributeId' });
Variant_Attribute_Value.belongsTo(Attribute, { foreignKey: 'attributeId', as: 'attribute' });

module.exports = {
  sequelize,
  Profile,
  Staff,
  Customer,
  Supplier,
  Category,
  Product,
  Variant,
  Receipt,
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
