const router = require("express").Router();

const ProductController = require("../controllers/ProductController");
const checkUser = require("../middlewares/checkUser");

// Adicionar um novo produto
router.post("/add", checkUser, ProductController.addProduct);

// Listar todos os produtos
router.get("/", checkUser, ProductController.getAllProducts);

// Obter detalhes de um produto
router.get("/:id", checkUser, ProductController.getProductById);

// Buscar produtos por nome
router.get("/findbyname/search", checkUser, ProductController.findProductsByName);

// Atualizar um produto
router.patch("/:id", checkUser, ProductController.updateProduct);

// Excluir um produto
router.delete("/:id", checkUser, ProductController.deleteProduct);

// Buscar produtos por categoria
router.get("/category/:categoryId", checkUser, ProductController.getProductsByCategory);



module.exports = router;
