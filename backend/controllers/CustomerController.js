const { Op } = require("sequelize");
const { Customer } = require("../models/associations/associations");

module.exports = class CustomerController {
  static async addCustomer(req, res) {
    const { name } = req.body;

    // Validação: Verificar se o nome foi fornecido
    if (!name) {
      return res
        .status(422)
        .json({ message: "O nome do cliente é obrigatório!" });
    }

    try {
      // Verificar se o cliente já existe
      const customerExists = await Customer.findOne({
        where: {
          nome: name.toUpperCase(),
        },
      });

      if (customerExists) {
        return res.status(422).json({ message: "Cliente já está cadastrado!" });
      }

      // Criar um novo cliente
      const newCustomer = await Customer.create({ nome: name.toUpperCase() });

      // Responder com sucesso
      res.status(201).json({
        message: "Cliente criado com sucesso!",
        newCustomer,
      });
    } catch (error) {
      console.error("Erro ao criar cliente: " + error);
      res.status(500).json({ message: "Erro ao criar cliente!" });
    }
  }

  static async getAllCustomers(req, res) {
    try {
      const customers = await Customer.findAll();
      res.status(200).json(customers);
    } catch (error) {
      console.error("Erro ao listar clientes: " + error);
      res.status(500).json({ message: "Erro ao listar clientes!" });
    }
  }
};
