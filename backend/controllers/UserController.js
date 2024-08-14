const { User } = require("../models/associations/associations");

module.exports = class UserController {
  static async register(req, res) {
    res.json("Olá usuário!");
  }
};
