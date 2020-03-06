"strict mode";
const Sequelize = require("sequelize");
const db = require("./database");
const bcrypt = require("bcryptjs");

const UserLogin = db.define(
  "login",
  {
    email: {
      type: Sequelize.STRING,
      allowNull: false
    },
    password: {
      type: Sequelize.STRING,
      allowNull: false
    }
  },
  {
    hooks: {
      beforeCreate: async user => {
        const saltRound = 10;
        const salt = await bcrypt.genSalt(saltRound);
        user.password = await bcrypt.hash(user.password, salt);
      }
    }
  }
);

module.exports = UserLogin;
