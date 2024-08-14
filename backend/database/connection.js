const { Sequelize } = require("sequelize");

const sequelize = new Sequelize("barzerich", "root", "caio123", {
  host: "localhost",
  dialect: "mysql",
});

try {
  sequelize.authenticate();
  console.log("Conectou ao MySQL no banco de dados barzerich !");
} catch (error) {
  console.log("Erro ao conectar ao banco de dados barzerich - " + error);
}

module.exports = sequelize;
