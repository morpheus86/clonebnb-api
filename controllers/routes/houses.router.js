const router = require("express").Router();

router.get("/", async (req, res, next) => {
  try {
    res.send("Its working MF");
  } catch (error) {
    next(err);
  }
});

module.exports = router;
