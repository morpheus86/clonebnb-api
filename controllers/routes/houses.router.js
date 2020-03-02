const router = require("express").Router();
const House = require("../../models/house.model");
const Review = require("../../models/reviews.model");
const User = require("../../models/user.model");
const Booking = require("../../models/bookings.model");
const { getDatesInBetween, checkIfBooked } = require("../functions/booking");
const Op = require("sequelize").Op;

router.get("/", async (req, res, next) => {
  try {
    const houses = await House.findAll();
    res.send(houses);
  } catch (error) {
    next(err);
  }
});

router.get("/:id", (req, res, next) => {
  try {
    const { id } = req.params;

    House.findByPk(id).then(house => {
      if (house) {
        Review.findAndCountAll({
          where: {
            id
          }
        }).then(reviews => {
          house.dataValues.reviews = reviews.rows.map(
            review => review.dataValues
          );
          house.dataValues.reviewsCount = reviews.count;
          res.writeHead(200, {
            "Content-Type": "application/json"
          });
          res.end(JSON.stringify(house.dataValues));
        });
      } else {
        res.writeHead(404, {
          "Content-Type": "application/json"
        });
        res.end(
          JSON.stringify({
            message: `Not found`
          })
        );
      }
    });
  } catch (error) {
    next(error);
  }
});

router.post("/booking", async (req, res) => {
  try {
    const { houseId, startDate, endDate, userEmail } = req.body;
    const user = await User.findOne({
      where: {
        email: userEmail
      }
    });
    const booking = await Booking.create({
      houseId,
      userId: user.dataValues.id,
      startDate,
      endDate
    });
    res.end(
      JSON.stringify({
        status: "success",
        message: "ok"
      })
    );
  } catch (error) {
    console.error(error);
  }
});

router.post("/booked", async (req, res, next) => {
  try {
    const houseId = req.body.houseId;
    const result = await Booking.findAll({
      where: {
        houseId,
        endDate: {
          [Op.gte]: new Date()
        }
      }
    });
    console.log("result", result);
    let bookedDate = [];
    for (const res of result) {
      console.log("res.dataValues.startDate", res.dataValues.startDate);
      const dates = getDatesInBetween(
        new Date(res.dataValues.startDate),
        new Date(res.dataValues.endDate)
      );
      bookedDate = [...bookedDate, ...dates];
    }
    bookedDate = [...new Set(bookedDate.map(date => date))];
    console.log("bookedDat", bookedDate);
    res.json({
      status: "success",
      message: "ok",
      dates: bookedDate
    });
  } catch (error) {
    next(error);
  }
});

router.post("/check", async (req, res) => {
  const { startdate, endDate, houseId } = req.body;
  let message = "free";
  const canBook = await checkIfBooked(houseId, startDate, endDate);
  if (!canBook) {
    message = "busy";
  }
  res.json({
    status: "success",
    message
  });
});

module.exports = router;
