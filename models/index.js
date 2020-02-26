"use strict";
const db = require("./database");
const House = require("./house.model");
const User = require("./user.model");
const UserLogin = require("./login.model");

module.exports = {
  db,
  House,
  User,
  UserLogin
};
