const { Category } = require("../models/associations/associations");

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
};
