const router = require("express").Router();

const ProductController = require("../controllers/ProductController");
const checkUser = require("../middlewares/checkUser");

router.post("/add", checkUser, ProductController.addProduct);

module.exports = router;
