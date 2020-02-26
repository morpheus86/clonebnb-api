"use strict";
const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const bcrypt = require("bcryptjs");
const cors = require("cors");
const routes = require("./controllers/routes");
const PORT = 4000;
const app = express();

app.use(morgan("combined"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/api", routes);

// custom error handling
app.use((err, req, res, next) => {
  // just in case
  if (!err.stack || !err.message) next(err);
  // clean up the trace to just relevant info
  const cleanTrace = err.stack
    .split("\n")
    .filter(line => {
      // comment out the next two lines for full (verbose) stack traces
      const projectFile = line.indexOf(__dirname) > -1; // omit built-in Node code
      const nodeModule = line.indexOf("node_modules") > -1; // omit npm modules
      return projectFile && !nodeModule;
    })
    .join("\n");
  // colorize and format the output
  console.log(chalk.magenta("      " + err.message));
  console.log("    " + chalk.gray(cleanTrace));
  // send back error status
  res.status(err.status || 500).end();
});

app.listen(PORT, () => {
  console.log(`application is running on port ${PORT}`);
});
module.exports = app;
