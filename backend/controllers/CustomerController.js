const { Op } = require("sequelize");
const { Customer, Order } = require("../models/associations/associations");

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
        return res.status(404).json({ message: "Cliente não encontrado!" });
      }

      // Verificar se o novo nome que será atualizado não existe em um cliente!
      const customerExists = await Customer.findOne({
        where: {
          nome: name,
        },
      });
      if (customerExists) {
        return res
          .status(404)
          .json({ message: "Esse cliente já está cadastrado !" });
      }

      // Atualizar o cliente
      customer.nome = name;
      await customer.save();

      // Responder com sucesso
      res.status(200).json({
        message: "Cliente atualizado com sucesso!",
        customer,
      });
    } catch (error) {
      console.error("Erro ao atualizar cliente: " + error);
      res.status(500).json({ message: "Erro ao atualizar cliente!" });
    }
  }

  static async deleteCustomerById(req, res) {
    const { id } = req.params;

    try {
      // Verificar se o cliente existe
      const customer = await Customer.findByPk(id);

      if (!customer) {
        return res.status(404).json({ message: "Cliente não encontrado!" });
      }

      // Verificar se o cliente tem pedidos associados
      const orders = await Order.findAll({ where: { cliente_id: id } });

      if (orders.length > 0) {
        return res.status(400).json({
          message:
            "Não é possível excluir o cliente porque ele tem pedidos associados. Exclua os pedidos do mesmo para concluir esta ação !",
        });
      }

      // Excluir o cliente
      await customer.destroy();

      res.status(200).json({ message: "Cliente excluído com sucesso!" });
    } catch (error) {
      console.error("Erro ao excluir cliente: " + error);
      res.status(500).json({ message: "Erro ao excluir cliente!" });
    }
  }
};
