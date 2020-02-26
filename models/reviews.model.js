"strict mode";
const Sequelize = require("sequelize");
const db = require("./database");

const Review = db.define("review", {
  houseId: { type: Sequelize.DataTypes.INTEGER, allowNull: false },
  userId: { type: Sequelize.DataTypes.INTEGER, allowNull: false },
  comment: { type: Sequelize.DataTypes.TEXT, allowNull: false }
});

module.exports = Review;
