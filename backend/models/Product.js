const { DataTypes } = require("sequelize");
const sequelize = require("../database/connection");
const Order = require("./Order");
const OrderProducts = require("./OrderProducts"); // Importar o modelo intermediário

const Product = sequelize.define(
  "Product",
  {
    nome: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    preco_venda: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    preco_custo: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    estoque: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
  },
  {
    timestamps: true,
    createdAt: "data_criacao",
    updatedAt: false,
    freezeTableName: true,
    tableName: "Produto",
  }
);



module.exports = Product;
