const router = require("express").Router();

const UserController = require("../controllers/UserController");
const checkUser = require("../middlewares/checkUser");

router.post("/register", UserController.register);
router.post("/login", UserController.login);
router.get("/profile", checkUser, UserController.profile);
router.get("/:id", UserController.getUserById);
router.patch("/edit", checkUser, UserController.editUserById);

module.exports = router;
