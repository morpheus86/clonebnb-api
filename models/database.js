"use strict";
const config = require("../controllers/config/config.json");
const Sequelize = require("sequelize");

module.exports = new Sequelize(
  config.database,
  config.username,
  config.password,
  config
);
