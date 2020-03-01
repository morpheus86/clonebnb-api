const router = require("express").Router();
const House = require("../../models/house.model");
const Review = require("../../models/reviews.model");
const Booking = require("../../models/bookings.model");

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
    // const { houseId, startDate, endDate } = req.body
    // User.findOne({
    //   where: {
    //     email
    //   }
    // })
    console.log("req", req.session);
  } catch (error) {
    console.error(error);
  }
});
module.exports = router;
