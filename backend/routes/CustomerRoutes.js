const router = require("express").Router();

const CustomerController = require("../controllers/CustomerController");
const checkUser = require("../middlewares/checkUser");

router.post("/add", checkUser, CustomerController.addCustomer);
router.get("/", checkUser, CustomerController.getAllCustomers);
router.get('/:id', checkUser, CustomerController.getCustomerById);
router.patch('/:id', checkUser, CustomerController.updateCustomerById);
router.delete('/:id', checkUser, CustomerController.deleteCustomerById);
/*
router.get('/findbyname/search', checkUser, CustomerController.searchCustomers);
*/

module.exports = router;
