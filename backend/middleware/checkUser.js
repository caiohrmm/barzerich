const jwt = require("jsonwebtoken");
const { User } = require("../models/associations/associations");
require("dotenv").config();

// Função para verificar o usuário com base no token
const checkUser = async (req, res, next) => {
  // Verifique se o token está presente no cabeçalho da solicitação
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: "Token não fornecido." });
  }

  const token = authHeader.split(" ")[1]; // o token está no formato "Bearer <token>"

  try {
    // Decodificar o token JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    // Buscar o usuário no banco de dados
    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({ message: "Usuário não encontrado." });
    }

    // Adicionar o usuário ao objeto `req` para que possa ser acessado em outros middlewares
    req.user = user;

    // Passar para o próximo middleware ou função de controlador
    next();
  } catch (error) {
    res.status(401).json({ message: "Token inválido ou expirado." });
  }
};

module.exports = checkUser;
