const checkUserExists = require("../helpers/check-user-exists");
const createUserToken = require("../helpers/create-user-token");
const { User } = require("../models/associations/associations");
const bcrypt = require("bcrypt");

module.exports = class UserController {
  static async register(req, res) {
    // Trazer os campos do body para o controller
    const { username, password, confirmPassword } = req.body;

    // Validações -> Enviar uma resposta de erro ao usuário caso algum campo não tenha chegado
    if (!username) {
      res.status(422).json({
        message: "O nome é obrigatório!",
      });
      return;
    }

    if (!password) {
      res.status(422).json({
        message: "A senha é obrigatória!",
      });
      return;
    }

    if (!confirmPassword) {
      res.status(422).json({
        message: "É necessário confirmar a senha!",
      });
      return;
    }

    // Analisar se a senha passada coincide com a confirmação de senha
    if (password != confirmPassword) {
      res.status(422).json({
        message: "As senhas não coincidem !!!",
      });
      return;
    }

    // Checkar se um usuário existe
    const userExists = await checkUserExists(username);

    // Se o username já existir ele não deixa criar um username igual.
    if (userExists) {
      res.status(422).json({
        message: "Por favor utilize outro nome de usuário !",
      });
      return;
    }

    // Criar uma senha criptografada
    const salt = await bcrypt.genSalt(12);
    const passwordHash = await bcrypt.hash(password, salt);

    // Criando meu obj de user para gravar no banco.
    const user = new User({
      username,
      senha: passwordHash,
    });

    // Gravando user no mysql
    try {
      const newUser = await user.save();
      await createUserToken(newUser, req, res);
    } catch (error) {
      console.error("Erro ao registrar usuário: " + error);
      res.status(500).json({ message: "Erro ao criar usuário!" });
    }
  }

  static async login(req, res) {
    const { username, password } = req.body;

    // Validações -> Enviar uma resposta de erro ao usuário caso algum campo não tenha chegado
    if (!username) {
      res.status(422).json({
        message: "O nome é obrigatório!",
      });
      return;
    }

    if (!password) {
      res.status(422).json({
        message: "A senha é obrigatória!",
      });
      return;
    }

    // Checkar se um usuário existe
    const userExists = await checkUserExists(username);

    // Se usuário não existir ele ainda não está cadastrado
    if (!userExists) {
      res.status(422).json({
        message:
          "Não existe nenhum usuário cadastrado em nosso sistema com esse nome!",
      });
      return;
    }

    // Checkar se a senha que chega no req.body coincide com a senha do usuário no banco de dados
    const checkPassword = await bcrypt.compare(password, userExists.senha);

    if (!checkPassword) {
      res.status(422).json({
        message: "Senha Inválida!",
      });
      return;
    }

    // Caso passar em todas as validações basta autenticar o usuário
    await createUserToken(userExists, req, res);
  }

  static async profile(req, res) {
    try {
      const user = req.user; // O usuário está no req.user devido ao middleware checkUser
      res.status(200).json({
        message: "Perfil do usuário recuperado com sucesso!",
        user,
      });
    } catch (error) {
      res.status(500).json({ message: "Erro ao recuperar perfil do usuário." });
    }
  }
};
