const sequelize = require("../database/connection");
const {
  Product,
  Order,
  OrderProducts,
  Customer,
} = require("../models/associations/associations");

module.exports = class OrderController {
  static async addOrder(req, res) {
    const { clientId, products } = req.body;

    // Validação: Verificar se o cliente e os produtos foram fornecidos
    if (!clientId || !products || products.length === 0) {
      return res
        .status(422)
        .json({ message: "Cliente e produtos são obrigatórios." });
    }

    try {
      // Verificar se o cliente existe
      const client = await Customer.findByPk(clientId);
      if (!client) {
        return res.status(404).json({ message: "Cliente não encontrado." });
      }

      // Verificar se todos os produtos existem
      const productIds = products.map((p) => p.productId);
      const foundProducts = await Product.findAll({
        where: { id: productIds },
      });

      // Verificar se todos os produtos passados são válidos
      const foundProductIds = foundProducts.map((p) => p.id);
      const invalidProducts = products.filter(
        (p) => !foundProductIds.includes(p.productId)
      );

      // Se houver produtos inválidos, retorne um erro
      if (invalidProducts.length > 0) {
        return res
          .status(404)
          .json({ message: "Um ou mais produtos são inválidos." });
      }

      // Verificar se os produtos têm estoque suficiente
      const outOfStockProducts = products.filter((p) => {
        const product = foundProducts.find((fp) => fp.id === p.productId);
        return product.estoque < p.amount;
      });

      // Se houver produtos sem estoque suficiente, retorne um erro
      if (outOfStockProducts.length > 0) {
        return res
          .status(400)
          .json({ message: "Um ou mais produtos não têm estoque suficiente." });
      }

      // Calcular o total do pedido
      let total = 0;
      products.forEach((p) => {
        const product = foundProducts.find((fp) => fp.id === p.productId);
        total += product.preco_venda * p.amount;
      });

      // Criar a transação para garantir consistência
      const transaction = await sequelize.transaction();

      try {
        // Criar o pedido
        const newOrder = await Order.create(
          { total, cliente_id: clientId },
          { transaction }
        );

        // Criar as entradas na tabela intermediária OrderProducts
        for (const p of products) {
          const product = foundProducts.find((fp) => fp.id === p.productId);

          // Verificar se o produto já está na tabela intermediária
          const existingOrderProduct = await OrderProducts.findOne({
            where: {
              pedido_id: newOrder.id,
              produto_id: product.id,
            },
            transaction,
          });

          if (existingOrderProduct) {
            // Se a combinação já existir, atualize a quantidade
            existingOrderProduct.quantidade += p.amount;
            existingOrderProduct.preco = product.preco_venda;
            await existingOrderProduct.save({ transaction });
          } else {
            // Se não existir, crie uma nova entrada
            await OrderProducts.create(
              {
                pedido_id: newOrder.id,
                produto_id: product.id,
                quantidade: p.amount,
                preco: product.preco_venda, // Salvar o preço do produto na criação do pedido
              },
              { transaction }
            );
          }
        }

        // Confirmar a transação
        await transaction.commit();

        // Responder com sucesso
        res.status(201).json({
          message: "Pedido criado com sucesso!",
          order: newOrder,
        });
      } catch (error) {
        // Reverter a transação em caso de erro
        await transaction.rollback();
        throw error;
      }
    } catch (error) {
      console.error("Erro ao criar pedido: " + error);
      res.status(500).json({ message: "Erro ao criar pedido." });
    }
  }

  static async getAllOrders(req, res) {
    try {
      const orders = await Order.findAll({
        include: [
          {
            model: Customer,
            attributes: ["nome"], // Supondo que o nome do cliente seja armazenado como 'nome'
          },
          {
            model: Product,
            through: { attributes: ["quantidade", "preco"] }, // Informações da tabela intermediária
          },
        ],
      });

      res.status(200).json(orders);
    } catch (error) {
      console.error("Erro ao buscar pedidos: " + error);
      res.status(500).json({ message: "Erro ao buscar pedidos." });
    }
  }

  static async getOrderById(req, res) {
    const { id } = req.params;

    try {
      const orderExists = await Order.findByPk(id);

      if (!orderExists) {
        return res.status(404).json({ message: "Pedido não encontrado." });
      }

      const order = await Order.findByPk(id, {
        include: [
          {
            model: Customer,
            attributes: ["nome"],
          },
          {
            model: Product,
            through: { attributes: ["quantidade", "preco"] },
          },
        ],
      });

      res.status(200).json(order);
    } catch (error) {
      console.error("Erro ao buscar pedido: " + error);
      res.status(500).json({ message: "Erro ao buscar pedido." });
    }
  }
  static async updateOrderStatus(req, res) {
    const { id } = req.params;
    const { status } = req.body;

    // Validação: Verificar se o status foi fornecido
    if (!status) {
      return res
        .status(422)
        .json({ message: "O status do pedido é obrigatório." });
    }

    try {
      const order = await Order.findByPk(id, {
        include: {
          model: Product,
          through: {
            model: OrderProducts, // Especificar explicitamente o modelo da tabela intermediária
            attributes: ["quantidade"], // Incluir a quantidade da tabela intermediária
          },
        },
      });

      if (!order) {
        return res.status(404).json({ message: "Pedido não encontrado." });
      }

      if (order.status === "concluído") {
        return res.status(404).json({
          message: "Não é possível alterar o status de um pedido concluído!",
        });
      }

      // Atualizar o status do pedido
      order.status = status;
      await order.save();

      // Se o status for "concluído", atualizar o estoque dos produtos
      if (status === "concluído") {
        for (const product of order.Products) {
          const quantidade = product.OrderProducts.quantidade;
          product.estoque -= quantidade;
          await product.save();
        }
      }

      res.status(200).json({
        message: "Status do pedido atualizado com sucesso.",
        order,
      });
    } catch (error) {
      console.error("Erro ao atualizar status do pedido: " + error);
      res.status(500).json({ message: "Erro ao atualizar status do pedido." });
    }
  }

  static async deleteOrder(req, res) {
    const { id } = req.params;

    try {
      const order = await Order.findByPk(id);

      if (!order) {
        return res.status(404).json({ message: "Pedido não encontrado." });
      }

      await order.destroy();

      res.status(200).json({ message: "Pedido excluído com sucesso." });
    } catch (error) {
      console.error("Erro ao excluir pedido: " + error);
      res.status(500).json({ message: "Erro ao excluir pedido." });
    }
  }

  static async getOrdersByCustomerId(req, res) {
    const { customerId } = req.params;

    try {
      // Verificar se o cliente existe
      const customer = await Customer.findByPk(customerId);
      if (!customer) {
        return res.status(404).json({ message: "Cliente não encontrado." });
      }

      // Buscar todos os pedidos associados a esse cliente
      const orders = await Order.findAll({
        where: { cliente_id: customerId },
        include: [
          {
            model: Product,
            through: {
              attributes: ["quantidade", "preco"], // Informações da tabela intermediária
            },
            attributes: ["id", "nome", "preco_venda", "preco_custo"], // Atributos específicos do produto
          },
        ],
      });

      // Verificar se o cliente possui pedidos
      if (orders.length === 0) {
        return res
          .status(404)
          .json({ message: "Nenhum pedido encontrado para este cliente." });
      }

      res.status(200).json(orders);
    } catch (error) {
      console.error("Erro ao buscar pedidos do cliente: " + error);
      res.status(500).json({ message: "Erro ao buscar pedidos do cliente." });
    }
  }
};
