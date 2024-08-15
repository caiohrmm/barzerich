const { Category, Product } = require("../models/associations/associations");

module.exports = class CategoryController {
  static async addCategory(req, res) {
    const { name } = req.body;

    // Validação: Verificar se o nome foi fornecido
    if (!name) {
      return res
        .status(422)
        .json({ message: "O nome da categoria é obrigatório!" });
    }

    try {
      // Verificar se a categoria já existe
      const categoryExists = await Category.findOne({ where: { nome: name } });
      if (categoryExists) {
        return res
          .status(422)
          .json({ message: "Categoria já está cadastrada!" });
      }

      // Criar uma nova categoria
      const newCategory = await Category.create({ nome: name });

      // Responder com sucesso
      res.status(201).json({
        message: "Categoria criada com sucesso!",
        newCategory,
      });
    } catch (error) {
      console.error("Erro ao criar categoria: " + error);
      res.status(500).json({ message: "Erro ao criar categoria!" });
    }
  }

  static async findAll(req, res) {
    try {
      // Buscar todas as categorias
      const categories = await Category.findAll();

      // Responder com sucesso
      res.status(200).json(categories);
    } catch (error) {
      console.error("Erro ao buscar categorias: " + error);
      res.status(500).json({ message: "Erro ao buscar categorias!" });
    }
  }

  static async deleteCategoryById(req, res) {
    const { id } = req.params;

    if (!id) {
      return res
        .status(422)
        .json({ message: "O ID da categoria é obrigatório!" });
    }

    try {
      // Verificar se a categoria existe
      const category = await Category.findByPk(id);
      if (!category) {
        return res.status(404).json({ message: "Categoria não encontrada!" });
      }

       // Verificar se o cliente tem pedidos associados
       const products = await Product.findAll({ where: { categoria_id: id } });

       if (products.length > 0) {
         return res.status(400).json({
           message:
             "Não é possível excluir a categoria porque ela tem produtos associados. Exclua os produtos da mesma para concluir essa ação !",
         });
       }

      // Excluir a categoria
      await category.destroy();

      // Responder com sucesso
      res.status(200).json({ message: "Categoria excluída com sucesso!" });
    } catch (error) {
      console.error("Erro ao excluir categoria: " + error);
      res.status(500).json({ message: "Erro ao excluir categoria!" });
    }
  }

  static async updateCategoryById(req, res) {
    const { id } = req.params;
    const { name } = req.body;

    // Validação: Verificar se o ID e o novo nome foram fornecidos
    if (!id) {
      return res
        .status(422)
        .json({ message: "O ID da categoria é obrigatório!" });
    }

    if (!name) {
      return res
        .status(422)
        .json({ message: "O novo nome da categoria é obrigatório!" });
    }

    try {
      // Verificar se a categoria existe
      const category = await Category.findByPk(id);
      if (!category) {
        return res.status(404).json({ message: "Categoria não encontrada!" });
      }

      // Verificar se o novo nome que será atualizado não existe em uma categoria!
      const categoryExists = await Category.findOne({
        where: {
          nome: name,
        },
      });
      if (categoryExists) {
        return res
          .status(404)
          .json({ message: "Essa categoria já está cadastrada !" });
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
