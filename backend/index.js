const express = require("express");
const cors = require("cors");

const app = express();

// Configurando a resposta em JSON.
app.use(express.json());

// Corrigindo erro de CORS -> Liberando acesso para o FRONTEND
app.use(cors({ credentials: true, origin: "http://localhost:3000" }));

// Pasta pública para imagens se houver
app.use(express.static("public"));

// Rotas de acesso

// Conexão sequelize
const connection = require("./database/connection");

const port = 5000;
// Se conectar ao banco de dados ele sobe a API
connection
  .sync()
  .then(() => app.listen(port))
  .catch((err) => console.log(err));
