const { DataTypes } = require("sequelize");
const sequelize = require("../database/connection");

const OrderProducts = sequelize.define(
  "OrderProducts",
  {
    quantidade: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    preco: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
  },
  {
    timestamps: false,
    freezeTableName: true,
    tableName: "PedidoProdutos",
  }
);

module.exports = OrderProducts;
