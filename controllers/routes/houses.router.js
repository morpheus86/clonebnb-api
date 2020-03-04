const router = require("express").Router();
const House = require("../../models/house.model");
const Review = require("../../models/reviews.model");
const User = require("../../models/user.model");
const Booking = require("../../models/bookings.model");
const { getDatesInBetween } = require("../functions/booking");
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

// router.post("/booking", async (req, res) => {
//   try {
//     const { houseId, startDate, endDate, userEmail } = req.body;
//     const user = await User.findOne({
//       where: {
//         email: userEmail
//       }
//     });
//     const booking = await Booking.create({
//       houseId,
//       userId: user.dataValues.id,
//       startDate,
//       endDate
//     });
//     res.end(
//       JSON.stringify({
//         status: "success",
//         message: "ok"
//       })
//     );
//   } catch (error) {
//     console.error(error);
//   }
// });

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
    next(error);
  }
});

router.post("/check", async (req, res) => {
  try {
    console.log("req.body check", req.body);
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

router.post("/reserve", async (req, res, next) => {
  try {
    const { houseId, startDate, endDate, user } = req.body;
    const canBookThoseDates = await checkIfBooked(houseId, startDate, endDate);
    console.log("check if booked", canBookThoseDates);
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
      endDate
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
module.exports = router;
