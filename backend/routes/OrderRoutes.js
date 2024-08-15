const router = require("express").Router();

const OrderController = require("../controllers/OrderController");
const checkUser = require("../middlewares/checkUser");

router.post("/add", checkUser, OrderController.addOrder);

module.exports = router;
