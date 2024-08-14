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

app.listen(5000);
