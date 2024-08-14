const Category = require("../Category");
const Product = require("../Product");
const Order = require("../Order");
const Customer = require("../Customer");
const User = require("../User");
const OrderProducts = require("../OrderProducts");

// Definir os relacionamentos
Category.hasMany(Product, { foreignKey: "categoria_id" });
Product.belongsTo(Category, { foreignKey: "categoria_id" });
Product.belongsToMany(Order, {
  through: OrderProducts, // Usar a referência da tabela do meio
  foreignKey: "produto_id",
});
Customer.hasMany(Order, { foreignKey: "cliente_id" });
Order.belongsTo(Customer, { foreignKey: "cliente_id" });
Order.belongsToMany(Product, {
  through: OrderProducts, // Usar a referência à tabela do meio
  foreignKey: "pedido_id",
});

// Exporte os modelos para uso em outros arquivos, se necessário
module.exports = { Category, Product, Order, Customer, User, OrderProducts };
