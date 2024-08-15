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
const UserRoutes = require("./routes/UserRoutes");
const ProductRoutes = require("./routes/ProductRoutes");
const CategoryRoutes = require("./routes/CategoryRoutes");
const CustomerRoutes = require("./routes/CustomerRoutes");

app.use("/users", UserRoutes);
app.use("/products", ProductRoutes);
app.use("/categories", CategoryRoutes);
app.use("/customers", CustomerRoutes);

// Conexão sequelize
const connection = require("./database/connection");

// Models
const associations = require("./models/associations/associations");

const port = 5000;
// Se conectar ao banco de dados ele sobe a API
connection
  .sync()
  .then(() => app.listen(port))
  .catch((err) => console.log(`Erro na criação do banco de dados ${err}`));
