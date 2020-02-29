"use strict";
const db = require("./database");
const House = require("./house.model");
const Review = require("./reviews.model");
const User = require("./user.model");
const UserLogin = require("./login.model");

module.exports = {
  db,
  House,
  Review,
  User,
  UserLogin
};
