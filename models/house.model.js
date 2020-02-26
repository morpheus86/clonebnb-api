"use strict";
const Sequelize = require("sequelize");
const db = require("./database");

const House = db.define(
  "house",
  {
    hostName: {
      type: Sequelize.STRING,
      allowNull: false
    },
    picture: {
      type: Sequelize.STRING,
      validate: {
        isUrl: true
      }
    },
    type: {
      type: Sequelize.STRING,
      allowNull: false
    },
    title: {
      type: Sequelize.STRING,
      allowNull: false
    },
    price: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    reviewsCount: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    superHost: {
      type: Sequelize.BOOLEAN,
      allowNull: false
    }
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
