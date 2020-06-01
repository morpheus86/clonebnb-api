"use strict";
const Sequelize = require("sequelize");

console.log("process.env.DATA_BASE_URL", process.env.DATA_BASE_URL);
module.exports = new Sequelize({
  dialect: "postgres",
  logging: false,
  connection: {
    connectonString: process.env.DATABASE_URL,
    ssl: true,
  },
});
