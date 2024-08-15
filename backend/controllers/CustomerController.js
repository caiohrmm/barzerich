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
          nome: name,
        },
      });

      if (customerExists) {
        return res.status(422).json({ message: "Cliente já está cadastrado!" });
      }

      // Criar um novo cliente
      const newCustomer = await Customer.create({ nome: name });

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

  static async getCustomerById(req, res) {
    const { id } = req.params;

    try {
      const customer = await Customer.findByPk(id);
      if (!customer) {
        return res.status(404).json({ message: "Cliente não encontrado!" });
      }
      res.status(200).json(customer);
    } catch (error) {
      console.error("Erro ao buscar cliente: " + error);
      res.status(500).json({ message: "Erro ao buscar cliente!" });
    }
  }

  static async updateCustomerById(req, res) {
    const { id } = req.params;
    const { name } = req.body;

    // Validação: Verificar se o ID e o novo nome foram fornecidos
    if (!id) {
      return res
        .status(422)
        .json({ message: "O ID do cliente é obrigatório!" });
    }

    if (!name) {
      return res
        .status(422)
        .json({ message: "O novo nome do cliente é obrigatório!" });
    }

    try {
      // Verificar se o cliente existe
      const customer = await Customer.findByPk(id);
      if (!customer) {
        return res.status(404).json({ message: "Cliente não encontrada!" });
      }

      // Atualizar a categoria
      category.nome = name;
      await category.save();

      // Responder com sucesso
      res.status(200).json({
        message: "Categoria atualizada com sucesso!",
        category,
      });
    } catch (error) {
      console.error("Erro ao atualizar categoria: " + error);
      res.status(500).json({ message: "Erro ao atualizar categoria!" });
    }
  }
};
