"use strict";
const bcrypt = require("bcryptjs");
const router = require("express").Router();
const UserLogin = require("../../models/login.model");
const User = require("../../models/user.model");

router.get("/", async (req, res, next) => {
  try {
  } catch (error) {
    next(error);
  }
});

module.exports = router;
