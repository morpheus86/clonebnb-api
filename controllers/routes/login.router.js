"use strict";
const router = require("express").Router();
const { signinAuthentication } = require("../functions/login");

const UserLogin = require("../../models/login.model");
const User = require("../../models/user.model");

router.post("/", async (req, res, next) => {
  try {
    await signinAuthentication(UserLogin, User, req, res);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
