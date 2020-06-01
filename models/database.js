"use strict";
const Sequelize = require("sequelize");
let database = process.env.DATABASE_URL;
let sequelize = "";

process.env.DATABASE_URL
  ? (sequelize = new Sequelize(database))
  : (sequelize = new Sequelize(database, "postgres", "", {
      dialect: postgres,
    }));

module.exports = sequelize;
