const { DataTypes } = require("sequelize");
const sequelize = require("../database/connection");

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
