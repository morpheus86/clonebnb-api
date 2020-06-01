const router = require("express").Router();
module.exports = router;

router.use("/login", require("./login.router"));
router.use("/house", require("./houses.router"));
router.use("/user", require("./user.router"));

// router.use((req, res, next) => {
//   const err = new Error("NOT FOUND");
//   error.status(404);
//   next(err);
// });
