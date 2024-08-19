const router = require("express").Router();

const OrderController = require("../controllers/OrderController");
const checkUser = require("../middlewares/checkUser");

router.post("/add", checkUser, OrderController.addOrder);
router.get("/", checkUser, OrderController.getAllOrders);
router.get("/:id", checkUser, OrderController.getOrderById);

module.exports = router;
