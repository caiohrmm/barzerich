const { DataTypes } = require("sequelize");
const sequelize = require("../database/connection");
const Customer = require("./Customer");
const Product = require("./Product");
const OrderProducts = require("./OrderProducts"); // Importar o modelo intermediário

const Order = sequelize.define(
  "Order",
  {
    status: {
      type: DataTypes.STRING,
      defaultValue: "em andamento",
    },
    total: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
  },
  {
    timestamps: true,
    createdAt: "data_pedido",
    updatedAt: false,
    freezeTableName: true,
    tableName: "Pedido",
  }
);



module.exports = Order;
