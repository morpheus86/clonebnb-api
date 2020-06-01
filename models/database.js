"use strict";
const Sequelize = require("sequelize");
// const user = "hamadoudiallo";
// const database = "bnb-clone";
// const password = "";
// const host = "localhost";

module.exports = new Sequelize({
  dialect: "postgres",
  logging: false,
  connection: {
    connectonString: process.env.DATABASE_URL,
    ssl: true,
  },
});
