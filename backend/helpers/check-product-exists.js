const { Product } = require("../models/associations/associations");
const checkProductExists = async (name) => {
  const product = await Product.findOne({
    where: {
      name,
    },
  });
  return product;
};

module.exports = checkProductExists;
