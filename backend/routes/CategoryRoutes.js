const router = require("express").Router();

const CategoryController = require("../controllers/CategoryController");
const checkUser = require("../middlewares/checkUser");

router.post("/add", checkUser, CategoryController.addCategory);
router.get("/", checkUser, CategoryController.findAll);
router.delete("/:id", checkUser, CategoryController.deleteCategoryById);
router.patch("/:id", checkUser, CategoryController.updateCategoryById);

module.exports = router;