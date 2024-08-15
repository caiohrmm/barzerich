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
};
