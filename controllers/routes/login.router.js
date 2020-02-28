"use strict";
const bcrypt = require("bcryptjs");
const router = require("express").Router();
const { handleSignin } = require("../functions/login");
const { handleProfile } = require("../functions/handleProfile");
const userLogin = require("../../models/login.model");
const user = require("../../models/user.model");

router.post("/", async (req, res, next) => {
  try {
    await handleSignin(userLogin, user, bcrypt, req, res);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
