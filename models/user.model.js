const Sequelize = require("sequelize");
const db = require("./database");
const bcrypt = require("bcryptjs");

const User = db.define(
  "user",
  {
    name: {
      type: Sequelize.STRING,
      allowNull: false
    },
    lastName: {
      type: Sequelize.STRING
      // allowNull: false
    },
    email: {
      type: Sequelize.STRING,
      validate: {
        isEmail: true
      }
    }
  },
  {
    hooks: {
      beforeValidate: user => {
        user.name = user.name[0].toUpperCase() + user.name.slice(1);
      },
      beforeCreate: async user => {
        const saltRounds = 10;
        const salt = await bcrypt.genSalt(saltRounds);
        user.password = await bcrypt.hash(user.password, salt);
      }
    }
  }
);

User.prototype.isPasswordValid = async password => {
  return await bcrypt.compare(password, this.password);
};

module.exports = User;
