"strict mode";
const Sequelize = require("sequelize");
const db = require("./database");

const Review = db.define("reviews", {
  houseId: { type: Sequelize.INTEGER, allowNull: false },
  user: { type: Sequelize.STRING },
  avatar: { type: Sequelize.STRING },
  comment: { type: Sequelize.TEXT, allowNull: false },
});

module.exports = Review;
