const jwt = require("jsonwebtoken");

// Carregar variáveis de ambiente
require("dotenv").config();

const createUserToken = async (user, req, res) => {
  // Criando token JWT
  const token = jwt.sign(
    {
      name: user.username,
      id: user.id,
    },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );

  // Retornar token
  res.status(200).json({
    message: "Você está autenticado !",
    token,
    userId: user.id,
  });
};

module.exports = createUserToken;
