"use strict";
const Sequelize = require("sequelize");
const db = require("./database");

const House = db.define("house", {
  host: { type: Sequelize.INTEGER, allowNull: false },
  picture: { type: Sequelize.STRING, allowNull: false },
  type: { type: Sequelize.STRING, allowNull: false },
  town: { type: Sequelize.STRING, allowNull: false },
  title: { type: Sequelize.STRING, allowNull: false },
  price: { type: Sequelize.INTEGER, allowNull: false },
  superhost: {
    type: Sequelize.BOOLEAN,
    allowNull: true,
    defaultValue: false,
  },
  description: { type: Sequelize.TEXT },
  guests: { type: Sequelize.INTEGER, allowNull: false },
  bedrooms: { type: Sequelize.INTEGER, allowNull: false },
  beds: { type: Sequelize.INTEGER, allowNull: false },
  baths: { type: Sequelize.INTEGER, allowNull: false },
  wifi: { type: Sequelize.BOOLEAN, allowNull: false },
  kitchen: { type: Sequelize.BOOLEAN, allowNull: false },
  heating: { type: Sequelize.BOOLEAN, allowNull: false },
  freeParking: { type: Sequelize.BOOLEAN, allowNull: false },
  entirePlace: { type: Sequelize.BOOLEAN, allowNull: false },
});

module.exports = House;
