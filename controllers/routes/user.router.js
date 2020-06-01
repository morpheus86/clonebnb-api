"use strict";

const router = require("express").Router();
const bcrypt = require("bcryptjs");
const User = require("../../models/user.model");
const UserLogin = require("../../models/login.model");
const { requireAuth } = require("../functions/login");
const { handleProfile } = require("../functions/handleProfile");

router.get("/:id", requireAuth, (req, res, next) => {
  try {
    handleProfile(User, req, res);
  } catch (error) {
    next(error);
  }
});

router.post("/logout", (req, res, next) => {
  try {
    // console.log("req.logout(", req.logout());
    console.log("req.logout(", req.session);
  } catch (error) {
    console.log(error);
  }
});

router.post("/register", async (req, res) => {
  if (req.method !== "POST") {
    res.status(405).end(); //Method Not Allowed
    return;
  }

  const { email, password, passwordConfirmation, name, lastName } = req.body;

  if (password !== passwordConfirmation) {
    res.end(
      JSON.stringify({ status: "error", message: "Passwords do not match" })
    );
    return;
  }

  try {
    // console.log("req.body", User);
    const hash = await bcrypt.hashSync(password);
    const userLogin = await UserLogin.create({ email, password: hash });
    const user = await User.create({
      name,
      lastName,
      email,
    });
    res.end(JSON.stringify({ status: "success", message: "User added" }));
  } catch (error) {
    res.statusCode = 500;
    let message = "An error occurred";
    if (error.name === "SequelizeUniqueConstraintError") {
      message = "User already exists";
    }
    res.end(JSON.stringify({ status: "error", message }));
  }
});

module.exports = router;
