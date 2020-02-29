"strict mode";
const Sequelize = require("sequelize");
const db = require("./database");

const Review = db.define("review", {
  user: { type: Sequelize.STRING },
  avatar: { type: Sequelize.STRING },
  comment: { type: Sequelize.TEXT, allowNull: false }
});

module.exports = Review;
