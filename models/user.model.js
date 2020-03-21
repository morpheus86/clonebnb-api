const Sequelize = require("sequelize");
const db = require("./database");

const User = db.define(
  "user",
  {
    name: {
      type: Sequelize.STRING,
      allowNull: false
    },
    lastName: {
      type: Sequelize.STRING,
      allowNull: false
    },
    email: {
      type: Sequelize.STRING,
      allowNull: false
    }
  },
  {
    hooks: {
      beforeValidate: user => {
        user.name = user.name[0].toUpperCase() + user.name.slice(1);
      }
    }
  }
);

module.exports = User;
