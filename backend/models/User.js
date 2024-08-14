const { DataTypes } = require("sequelize");
const sequelize = require("../database/connection");

const User = sequelize.define(
  "User",
  {
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    senha: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    timestamps: true,
    createdAt: "data_criacao",
    updatedAt: false,
    freezeTableName: false,
    tableName: "Usuario",
  }
);

module.exports = User;
