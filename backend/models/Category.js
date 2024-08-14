const { DataTypes } = require("sequelize");
const sequelize = require("../database/connection");

const Category = sequelize.define(
  "Category",
  {
    nome: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    timestamps: true,
    createdAt: "data_criacao",
    updatedAt: false,
    freezeTableName: true,
    tableName: "Categoria",
  }
);

module.exports = Category;
