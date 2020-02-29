"use strict";
const Sequelize = require("sequelize");
const db = require("./database");

const House = db.define(
  "house",
  {
    hostName: { type: Sequelize.STRING, allowNull: false },
    picture: { type: Sequelize.STRING, allowNull: false },
    type: { type: Sequelize.STRING, allowNull: false },
    town: { type: Sequelize.STRING, allowNull: false },
    title: { type: Sequelize.STRING, allowNull: false },
    price: { type: Sequelize.INTEGER, allowNull: false },
    superhost: { type: Sequelize.BOOLEAN, allowNull: false },
    description: { type: Sequelize.TEXT },
    guests: { type: Sequelize.INTEGER, allowNull: false },
    bedrooms: { type: Sequelize.INTEGER, allowNull: false },
    beds: { type: Sequelize.INTEGER, allowNull: false },
    baths: { type: Sequelize.INTEGER, allowNull: false },
    wifi: { type: Sequelize.BOOLEAN, allowNull: false },
    kitchen: { type: Sequelize.BOOLEAN, allowNull: false },
    heating: { type: Sequelize.BOOLEAN, allowNull: false },
    freeParking: { type: Sequelize.BOOLEAN, allowNull: false },
    entirePlace: { type: Sequelize.BOOLEAN, allowNull: false }
  },
  {
    hooks: {
      beforeCreate: (user, options) => {
        !user.rating ? user.rating === 5 : user.rating;
      }
    }
  }
);

module.exports = House;
