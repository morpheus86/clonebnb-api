const router = require("express").Router();
const House = require("../../models/house.model");
const Review = require("../../models/reviews.model");
const User = require("../../models/user.model");
const Booking = require("../../models/bookings.model");
const { getDatesInBetween } = require("../functions/booking");
const { requireAuth } = require("../functions/login");
const Op = require("sequelize").Op;

const checkIfBooked = async (id, start, end) => {
  const res = await Booking.findAll({
    where: {
      startDate: {
        [Op.lte]: new Date(end)
      },
      endDate: {
        [Op.gte]: new Date(start)
      }
    }
  });
  return !(res.length > 0);
};

router.get("/", async (req, res, next) => {
  try {
    const houses = await House.findAll();
    res.send(houses);
  } catch (error) {
    next(error);
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

    let bookedDate = [];
    for (const res of result) {
      const dates = getDatesInBetween(
        new Date(res.dataValues.startDate),
        new Date(res.dataValues.endDate)
      );
      bookedDate = [...bookedDate, ...dates];
    }
    bookedDate = [...new Set(bookedDate.map(date => date))];

    res.json({
      status: "success",
      message: "ok",
      dates: bookedDate
    });
  } catch (error) {
    console.log(
      JSON.stringify({
        error
      })
    );
  }
});

router.post("/check", requireAuth, async (req, res) => {
  try {
    const { startDate, endDate, houseId } = req.body;
    let message = "free";
    const canBook = await checkIfBooked(houseId, startDate, endDate);
    if (!canBook) {
      message = "busy";
    }
    res.json({
      status: "success",
      message
    });
  } catch (err) {
    console.log(err);
  }
});

router.post("/reserve", requireAuth, async (req, res, next) => {
  try {
    const { houseId, startDate, endDate, user, reserved } = req.body;
    const canBookThoseDates = await checkIfBooked(houseId, startDate, endDate);

    if (!canBookThoseDates) {
      res.writeHead(500, {
        "content-type": "application.json"
      });
      res.end(
        JSON.stringify({
          status: "error",
          message: "House is already booked"
        })
      );
      return;
    }
    const userInfo = await User.findOne({
      where: {
        email: user
      }
    });
    const date = await Booking.create({
      houseId,
      userId: userInfo.dataValues.id,
      startDate,
      endDate,
      reserved
    });
    res.sendStatus(200).end(
      JSON.stringify({
        status: "success",
        message: "ok"
      })
    );
  } catch (error) {
    next(error);
  }
});

router.get("/bookings/list/:userId", requireAuth, async (req, res, next) => {
  try {
    const id = req.params.userId;
    const booking = await Booking.findAll({
      where: {
        userId: id
      }
    });
    const houseBooked = await Promise.all(
      booking.map(async booked => {
        const data = {};
        data.booking = booked.dataValues;
        const houses = await House.findByPk(data.booking.houseId);
        data.house = houses.dataValues;

        return data;
      })
    );
    res.end(JSON.stringify(houseBooked));
  } catch (err) {
    console.log(err);
  }
});

router.get("/host/list/:userId", requireAuth, async (req, res, next) => {
  try {
    const { userId } = req.params;
    const user = await User.findOne({
      where: {
        id: userId
      }
    });
    const houses = await House.findAll({
      where: {
        id: user.dataValues.id
      }
    });

    const houseId = houses.map(house => house.dataValues.id);

    const bookingData = await Booking.findAll({
      where: {
        houseId: {
          [Op.in]: houseId
        },
        endDate: {
          [Op.gte]: new Date()
        }
      },
      order: [["startDate", "ASC"]]
    });

    const book = await Promise.all(
      bookingData.map(async b => {
        return {
          booking: b.dataValues,
          house: houses.filter(
            house => house.dataValues.id === b.dataValues.houseId
          )[0].dataValues
        };
      })
    );
    res.writeHead(200, {
      "Content-Type": "application/json"
    });
    res.end(
      JSON.stringify({
        book,
        houses
      })
    );
  } catch (error) {
    console.log(error);
  }
});
module.exports = router;
