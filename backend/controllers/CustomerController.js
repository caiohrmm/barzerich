const { Op } = require("sequelize");
const {
  Customer,
  Order,
  Product,
} = require("../models/associations/associations");
const ExcelJS = require("exceljs");
const fs = require("fs");
const path = require("path");
const formatDate = require("../helpers/format-date");

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

  static async searchCustomers(req, res) {
    const { name } = req.query;

    if (!name) {
      return res
        .status(422)
        .json({ message: "O nome é obrigatório para a busca!" });
    }

    try {
      const customers = await Customer.findAll({
        where: {
          nome: {
            [Op.like]: `%${name}%`,
          },
        },
      });

      if (customers.length === 0) {
        return res
          .status(404)
          .json({ message: "Nenhum cliente encontrado com esse nome." });
      }

      res.status(200).json(customers);
    } catch (error) {
      console.error("Erro ao buscar clientes: " + error);
      res.status(500).json({ message: "Erro ao buscar clientes!" });
    }
  }

  static async generateCustomerReport(req, res) {
    try {
      // Verificar se o diretório 'reports' existe, se não, criar
      const reportsDir = path.join(__dirname, "..", "reports");
      if (!fs.existsSync(reportsDir)) {
        fs.mkdirSync(reportsDir);
      }

      // Buscar todos os clientes e incluir os pedidos e produtos associados
      const customers = await Customer.findAll({
        include: {
          model: Order,
          attributes: ["id"],
          include: {
            model: Product,
            attributes: ["nome"],
            through: {
              attributes: ["quantidade", "preco"], // Inclua a quantidade e o preço da tabela intermediária
            },
          },
        },
      });

      if (!customers || customers.length === 0) {
        return res
          .status(404)
          .json({ message: "Nenhum cliente encontrado para o relatório." });
      }

      // Criar uma nova planilha Excel
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("Relatório de Clientes");

      // Adicionar título ao Excel
      worksheet.mergeCells("A1", "D1");
      worksheet.getCell("A1").value = "Relatório de Clientes";
      worksheet.getCell("A1").font = { size: 20, bold: true };
      worksheet.getCell("A1").alignment = {
        vertical: "middle",
        horizontal: "center",
      };

      // Adicionar cabeçalhos de coluna
      worksheet.addRow([
        "Nome",
        "Data de Cadastro",
        "Total de Pedidos",
        "Total Gasto",
      ]);

      // Adicionar dados de cada cliente ao Excel
      customers.forEach((customer) => {
        // Calcular o valor total gasto pelo cliente
        let totalSpent = 0;
        customer.Orders.forEach((order) => {
          order.Products.forEach((product) => {
            const quantidade = product.PedidoProdutos?.quantidade || 0;
            const preco = product.PedidoProdutos?.preco || 0;
            totalSpent += quantidade * preco;
          });
        });

        // Adicionar uma linha para cada cliente
        worksheet.addRow([
          customer.nome,
          formatDate(new Date(customer.data_criacao)),
          customer.Orders.length || 0,
          `R$ ${totalSpent.toFixed(2)}`,
        ]);
      });

      // Definir o caminho e o nome do arquivo Excel
      const filePath = path.join(reportsDir, "CustomerReport.xlsx");

      // Escrever o arquivo Excel
      await workbook.xlsx.writeFile(filePath);

      // Enviar o arquivo Excel como resposta
      res.download(filePath, "CustomerReport.xlsx", (err) => {
        if (err) {
          console.error("Erro ao enviar o Excel:", err);
          return res
            .status(500)
            .json({ message: "Erro ao enviar o relatório." });
        }

        // Opcional: deletar o arquivo após enviar
        fs.unlinkSync(filePath);
      });
    } catch (error) {
      console.error("Erro ao gerar relatório de clientes:", error);
      res.status(500).json({ message: "Erro ao gerar relatório de clientes." });
    }
  }
};
