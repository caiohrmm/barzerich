const router = require("express").Router();

const CategoryController = require("../controllers/CategoryController");
const checkUser = require("../middlewares/checkUser");

router.post("/add", checkUser, CategoryController.addCategory);

module.exports = router;