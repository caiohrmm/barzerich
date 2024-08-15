const { Op } = require("sequelize");
const checkProductExists = require("../helpers/check-product-exists");
const { Product, Category } = require("../models/associations/associations");

module.exports = class ProductController {
  static async addProduct(req, res) {
    const { name, salePrice, costPrice, stock, categoryId } = req.body;

    // Validação de campos obrigatórios
    if (!name) {
      return res
        .status(422)
        .json({ message: "O nome do produto é obrigatório !" });
    }

    if (!salePrice) {
      return res
        .status(422)
        .json({ message: "O preço de venda é obrigatório !" });
    }

    if (!costPrice) {
      return res
        .status(422)
        .json({ message: "O preço de custo é obrigatório !" });
    }

    if (!categoryId) {
      return res
        .status(422)
        .json({ message: "A categoria do produto é obrigatória !" });
    }

    try {
      // Verificar se a categoria existe
      const categoryExists = await Category.findByPk(categoryId);

      if (!categoryExists) {
        return res.status(404).json({ message: "Categoria não encontrada!" });
      }

      // Criar novo produto
      const product = await Product.create({
        nome: name,
        preco_venda: salePrice,
        preco_custo: costPrice,
        estoque: stock || 0,
        categoria_id: categoryId,
      });

      return res
        .status(201)
        .json({ message: "Produto criado com sucesso!", product });
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Erro ao criar produto !", error });
    }
  }

  // Listar todos os produtos
  static async getAllProducts(req, res) {
    try {
      const products = await Product.findAll();
      res.status(200).json(products);
    } catch (error) {
      res.status(500).json({ message: "Erro ao listar produtos", error });
    }
  }

  // Obter detalhes de um produto
  static async getProductById(req, res) {
    const { id } = req.params;

    try {
      const product = await Product.findByPk(id);
      if (product) {
        res.status(200).json(product);
      } else {
        res.status(404).json({ message: "Produto não encontrado" });
      }
    } catch (error) {
      res.status(500).json({ message: "Erro ao obter produto", error });
    }
  }

  // Atualizar um produto
  static async updateProduct(req, res) {
    const { id } = req.params; // Obtém o ID do produto a partir dos parâmetros da URL
    const { name, salePrice, costPrice, stock, categoryId } = req.body; // Obtém os dados para atualização do corpo da solicitação

    try {
      // Encontra o produto pelo ID
      const product = await Product.findByPk(id);

      if (!product) {
        return res.status(404).json({ message: "Produto não encontrado!" });
      }

      // Se categoryId foi fornecido, verificar se a categoria existe
      if (categoryId) {
        const categoryExists = await Category.findByPk(categoryId);

        if (!categoryExists) {
          return res.status(404).json({ message: "Categoria não encontrada!" });
        }
      }

      // Atualiza os campos do produto se fornecidos no corpo da solicitação
      if (name) product.nome = name;
      if (salePrice) product.preco_venda = salePrice;
      if (costPrice) product.preco_custo = costPrice;
      if (stock) product.estoque = stock;
      if (categoryId) product.categoria_id = categoryId;

      // Salva as alterações no banco de dados
      await product.save();

      res.status(200).json({
        message: "Produto atualizado com sucesso!",
        product,
      });
    } catch (error) {
      console.error("Erro ao atualizar produto: " + error);
      res.status(500).json({ message: "Erro ao atualizar produto!" });
    }
  }

  // Excluir um produto
  static async deleteProduct(req, res) {
    const { id } = req.params;

    try {
      const deleted = await Product.destroy({ where: { id } });
      if (deleted) {
        res.status(200).json({
          message: "Produto excluído com sucesso!",
        });
      } else {
        res.status(404).json({ message: "Produto não encontrado" });
      }
    } catch (error) {
      res.status(500).json({ message: "Erro ao excluir produto", error });
    }
  }

  static async getProductsByCategory(req, res) {
    const { categoryId } = req.params; // Obter ID da categoria

    try {
      // Verifica se a categoria existe
      const categoryExists = await Category.findByPk(categoryId);

      if (!categoryExists) {
        return res.status(404).json({ message: "Categoria não encontrada!" });
      }

      // Encontra todos os produtos da categoria especificada
      const products = await Product.findAll({
        where: {
          categoria_id: categoryId,
        },
      });

      res.status(200).json(products);
    } catch (error) {
      console.error("Erro ao buscar produtos por categoria: " + error);
      res
        .status(500)
        .json({ message: "Erro ao buscar produtos por categoria!" });
    }
  }

  // Buscar produtos por nome
  static async findProductsByName(req, res) {
    const { name } = req.query;

    // Verificar se o parâmetro de nome foi fornecido
    if (!name) {
      return res
        .status(422)
        .json({ message: "O parâmetro 'name' é obrigatório." });
    }

    try {
      // Buscar produtos pelo nome
      const products = await Product.findAll({
        where: {
          nome: {
            [Op.like]: `%${name}%`,
          },
        },
        include: Category, // Opcional: incluir a categoria do produto
      });

      // Se nenhum produto for encontrado
      if (products.length === 0) {
        return res
          .status(404)
          .json({ message: "Nenhum produto encontrado com esse nome." });
      }

      // Retornar os produtos encontrados
      res.status(200).json(products);
    } catch (error) {
      console.error("Erro ao buscar produtos por nome:", error);
      res.status(500).json({ message: "Erro ao buscar produtos." });
    }
  }
};
