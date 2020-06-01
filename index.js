"use strict";
const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const bcrypt = require("bcryptjs");
const cors = require("cors");
const routes = require("./controllers/routes");
const Booking = require("./models/bookings.model");
const User = require("./models/user.model");
const Review = require("./models/reviews.model");
const UserLogin = require("./models/login.model");
const House = require("./models/house.model");

const PORT = process.env.PORT || 4000;
const app = express();

app.use(morgan("combined"));
app.use("/upload", express.static("public"));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.get("/", (req, res, next) => {
  try {
    res.send("voila");
  } catch (error) {
    next(error);
  }
});
app.use("/api", routes);

// custom error handling
app.use((err, req, res, next) => {
  if (!err.stack || !err.message) next(err);

  const cleanTrace = err.stack
    .split("\n")
    .filter((line) => {
      const projectFile = line.indexOf(__dirname) > -1;
      const nodeModule = line.indexOf("node_modules") > -1;
      return projectFile && !nodeModule;
    })
    .join("\n");

  res.status(err.status || 500).end();
});

User.sync({ alter: true });
House.sync({ alter: true });
Review.sync({ alter: true });
UserLogin.sync({ alter: true });
Booking.sync({ alter: true });
app.listen(PORT, () => {
  console.log(`application is running on port ${PORT}`);
});

module.exports = app;
