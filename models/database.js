"use strict";
const Sequelize = require("sequelize");
const user = "hamadoudiallo";
const database = "bnb-clone";
const password = "";
const host = "localhost";

module.exports = new Sequelize(database, user, password, {
  host,
  dialect: "postgres",
  logging: false,
});
