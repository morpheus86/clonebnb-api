"use strict";
const Sequelize = require("sequelize");

module.exports = new Sequelize({
  dialect: "postgres",
  logging: false,
  connection: {
    connectonString: process.env.DATABASE_URL,
    ssl: true,
  },
});
