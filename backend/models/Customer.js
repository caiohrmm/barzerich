// Model para os clientes
const { DataTypes } = require("sequelize");
const sequelize = require("../database/connection"); // Importa a conexão
const Order = require("./Order");

const Customer = sequelize.define(
  "Customer",
  {
    nome: {
      type: DataTypes.STRING,
      allowNull: false, // O nome do cliente é obrigatório
    },
  },
  {
    timestamps: true, // Adiciona automaticamente 'createdAt' e 'updatedAt'
    createdAt: "data_criacao", // Renomeia 'createdAt' para 'data_criacao'
    updatedAt: false, // Não precisa de 'updatedAt'
    freezeTableName: true,
    tableName: "Cliente",
  }
);



module.exports = Customer;
