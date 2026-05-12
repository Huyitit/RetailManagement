const sequelize = require('../configs/db');
const Store = require('./Store');
const Staff = require('./Staff');
const Customer = require('./Customer');
const Supplier = require('./Supplier');
const Category = require('./Category');
const Product = require('./Product');
const Variant = require('./Variant');
const Order = require('./Order');
const ImportReceipt = require('./ImportReceipt');
const OrderDetail = require('./OrderDetail');
const ImportDetail = require('./ImportDetail');
const ExportReceipt = require('./ExportReceipt');
const ExportDetail = require('./ExportDetail');
const Promotion = require('./Promotion');
const PromotionVariant = require('./PromotionVariant');
const Warranty = require('./Warranty');
const Attribute = require('./Attribute');
const VariantAttribute = require('./VariantAttribute');
const ProductSupplier = require('./ProductSupplier');

// Store - Staff
Store.hasMany(Staff, { foreignKey: 'storeId' });
Staff.belongsTo(Store, { foreignKey: 'storeId' });

// Category - Product
Category.hasMany(Product, { foreignKey: 'categoryId' });
Product.belongsTo(Category, { foreignKey: 'categoryId' });

// Product - Variant
Product.hasMany(Variant, { foreignKey: 'productId' });
Variant.belongsTo(Product, { foreignKey: 'productId' });

// Product - Supplier (Many-to-Many)
Product.belongsToMany(Supplier, { through: ProductSupplier, foreignKey: 'productId' });
Supplier.belongsToMany(Product, { through: ProductSupplier, foreignKey: 'supplierId' });

// Staff - Order
Staff.hasMany(Order, { foreignKey: 'staffId' });
Order.belongsTo(Staff, { foreignKey: 'staffId' });

// Customer - Order
Customer.hasMany(Order, { foreignKey: 'customerId' });
Order.belongsTo(Customer, { foreignKey: 'customerId' });

// Order - OrderDetail
Order.hasMany(OrderDetail, { foreignKey: 'orderId' });
OrderDetail.belongsTo(Order, { foreignKey: 'orderId' });

// Variant - OrderDetail
Variant.hasMany(OrderDetail, { foreignKey: 'variantId' });
OrderDetail.belongsTo(Variant, { foreignKey: 'variantId' });

// Supplier - ImportReceipt
Supplier.hasMany(ImportReceipt, { foreignKey: 'supplierId' });
ImportReceipt.belongsTo(Supplier, { foreignKey: 'supplierId' });

// ImportReceipt - ImportDetail
ImportReceipt.hasMany(ImportDetail, { foreignKey: 'importReceiptId' });
ImportDetail.belongsTo(ImportReceipt, { foreignKey: 'importReceiptId' });

// Variant - ImportDetail
Variant.hasMany(ImportDetail, { foreignKey: 'variantId' });
ImportDetail.belongsTo(Variant, { foreignKey: 'variantId' });

// Supplier - ImportDetail
Supplier.hasMany(ImportDetail, { foreignKey: 'supplierId' });
ImportDetail.belongsTo(Supplier, { foreignKey: 'supplierId' });

// Supplier - ExportReceipt
Supplier.hasMany(ExportReceipt, { foreignKey: 'supplierId' });
ExportReceipt.belongsTo(Supplier, { foreignKey: 'supplierId' });

// ExportReceipt - ExportDetail
ExportReceipt.hasMany(ExportDetail, { foreignKey: 'exportReceiptId' });
ExportDetail.belongsTo(ExportReceipt, { foreignKey: 'exportReceiptId' });

// Variant - ExportDetail
Variant.hasMany(ExportDetail, { foreignKey: 'variantId' });
ExportDetail.belongsTo(Variant, { foreignKey: 'variantId' });

// Promotion - Variant (Many-to-Many)
Promotion.belongsToMany(Variant, { through: PromotionVariant, foreignKey: 'promotionId' });
Variant.belongsToMany(Promotion, { through: PromotionVariant, foreignKey: 'variantId' });

// OrderDetail - Warranty
OrderDetail.hasMany(Warranty, { foreignKey: 'orderDetailId' });
Warranty.belongsTo(OrderDetail, { foreignKey: 'orderDetailId' });

// Staff - Warranty
Staff.hasMany(Warranty, { foreignKey: 'staffId' });
Warranty.belongsTo(Staff, { foreignKey: 'staffId' });

// Variant - VariantAttribute
Variant.hasMany(VariantAttribute, { foreignKey: 'variantId', as: 'attributeValues' });
VariantAttribute.belongsTo(Variant, { foreignKey: 'variantId' });

// Attribute - VariantAttribute
Attribute.hasMany(VariantAttribute, { foreignKey: 'attributeId' });
VariantAttribute.belongsTo(Attribute, { foreignKey: 'attributeId', as: 'attribute' });

module.exports = {
  sequelize,
  Store,
  Staff,
  Customer,
  Supplier,
  Category,
  Product,
  Variant,
  Order,
  ImportReceipt,
  OrderDetail,
  ImportDetail,
  ExportReceipt,
  ExportDetail,
  Promotion,
  PromotionVariant,
  Warranty,
  Attribute,
  VariantAttribute,
  ProductSupplier
};


