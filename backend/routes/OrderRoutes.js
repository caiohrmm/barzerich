const router = require("express").Router();

const OrderController = require("../controllers/OrderController");
const checkUser = require("../middlewares/checkUser");

router.post("/add", checkUser, OrderController.addOrder);
router.get("/", checkUser, OrderController.getAllOrders);
router.get(
  "/customer/:customerId",
  checkUser,
  OrderController.getOrdersByCustomerId
);
router.get("/:id", checkUser, OrderController.getOrderById);
router.patch("/status/:id", checkUser, OrderController.updateOrderStatus);
router.get("/report/generate", checkUser, OrderController.generateOrderReport);
router.delete("/:id", checkUser, OrderController.deleteOrder);

module.exports = router;
