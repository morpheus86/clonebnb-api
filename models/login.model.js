"strict mode";
const Sequelize = require("sequelize");
const db = require("./database");

const UserLogin = db.define("login", {
  email: {
    type: Sequelize.TEXT,
    allowNull: false
  },
  password: {
    type: Sequelize.TEXT,
    allowNull: false
  }
});

module.exports = UserLogin;
