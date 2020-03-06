"use strict";
const Sequelize = require("sequelize");
const db = require("./database");

const Booking = db.define("booking", {
  houseId: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  userId: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  startDate: {
    type: Sequelize.DATEONLY,
    allowNull: false
  },
  endDate: {
    type: Sequelize.DATEONLY,
    allowNull: false
  },
  reserved: {
    type: Sequelize.BOOLEAN,
    defaultValue: false
  }
});

module.exports = Booking;
