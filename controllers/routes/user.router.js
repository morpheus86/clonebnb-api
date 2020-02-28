"use strict";

const router = require("express").Router();
const user = require("../../models/user.model");
const { handleProfile } = require("../functions/handleProfile");

router.get("/:id", (req, res, next) => {
  try {
    handleProfile(user, req, res);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
