const { User } = require("../models/associations/associations");
const checkUserExists = async (username) => {
  const user = await User.findOne({
    where: {
      username,
    },
  });
  return user
};

module.exports = checkUserExists;
