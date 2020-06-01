"use strict";
const router = require("express").Router();
const fs = require("fs");
const House = require("../../models/house.model");
const Review = require("../../models/reviews.model");
const User = require("../../models/user.model");
const Booking = require("../../models/bookings.model");
const { getDatesInBetween } = require("../functions/booking");
const { requireAuth } = require("../functions/login");
const Op = require("sequelize").Op;
const sanitizeHtml = require("sanitize-html");
const multer = require("multer");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./public/");
  },
  filename: (req, file, cb) => {
    var filetype = "";
    if (file.mimetype === "image/gif") {
      filetype = "gif";
    }
    if (file.mimetype === "image/png") {
      filetype = "png";
    }
    if (file.mimetype === "image/jpeg") {
      filetype = "jpg";
    }
    cb(null, "image-" + Date.now() + "." + filetype);
  },
});
var upload = multer({ storage: storage });

const checkIfBooked = async (id, start, end) => {
  const res = await Booking.findAll({
    where: {
      startDate: {
        [Op.lte]: new Date(end),
      },
      endDate: {
        [Op.gte]: new Date(start),
      },
    },
  });
  return !(res.length > 0);
};

router.get("/", async (req, res, next) => {
  try {
    // const houseFound = await House.findAll();

    res.send("voila we are here");
  } catch (error) {
    next(error);
  }
});

router.get("/:id", (req, res, next) => {
  try {
    const { id } = req.params;

    House.findByPk(id).then((house) => {
      if (house) {
        Review.findAndCountAll({
          where: {
            id,
          },
        }).then((reviews) => {
          house.dataValues.reviews = reviews.rows.map(
            (review) => review.dataValues
          );
          house.dataValues.reviewsCount = reviews.count;
          res.writeHead(200, {
            "Content-Type": "application/json",
          });
          res.end(JSON.stringify(house.dataValues));
        });
      } else {
        res.writeHead(404, {
          "Content-Type": "application/json",
        });
        res.end(
          JSON.stringify({
            message: `Not found`,
          })
        );
      }
    });
  } catch (error) {
    next(error);
  }
});

router.post("/booked", async (req, res) => {
  try {
    const houseId = req.body.houseId;
    const result = await Booking.findAll({
      where: {
        houseId,
        endDate: {
          [Op.gte]: new Date(),
        },
      },
    });

    let bookedDate = [];
    for (const res of result) {
      const dates = getDatesInBetween(
        new Date(res.dataValues.startDate),
        new Date(res.dataValues.endDate)
      );
      bookedDate = [...bookedDate, ...dates];
    }
    bookedDate = [...new Set(bookedDate.map((date) => date))];

    res.json({
      status: "success",
      message: "ok",
      dates: bookedDate,
    });
  } catch (error) {
    console.log(
      JSON.stringify({
        error,
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
      message,
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
        "content-type": "application.json",
      });
      res.end(
        JSON.stringify({
          status: "error",
          message: "House is already booked",
        })
      );
      return;
    }
    const userInfo = await User.findOne({
      where: {
        email: user,
      },
    });
    const date = await Booking.create({
      houseId,
      userId: userInfo.dataValues.id,
      startDate,
      endDate,
      reserved,
    });
    res.sendStatus(200).end(
      JSON.stringify({
        status: "success",
        message: "ok",
      })
    );
  } catch (error) {
    next(error);
  }
});

router.get("/bookings/list/:userId", requireAuth, async (req, res, next) => {
  try {
    const { userId } = req.params;
    const user = await User.findOne({
      where: {
        id: userId,
      },
    });
    const houses = await House.findAll({
      where: {
        host: user.id,
      },
    });
    const houseIds = houses.map((house) => house.dataValues.id);
    const bookingData = await Booking.findAll({
      where: {
        reserved: true,
        houseId: {
          [Op.in]: houseIds,
        },
        endDate: {
          [Op.gte]: new Date(),
        },
      },
      order: [["startDate", "ASC"]],
    });
    const bookings = await Promise.all(
      bookingData.map(async (book) => {
        return {
          booking: book.dataValues,
          house: houses.filter(
            (house) => house.dataValues.id === book.dataValues.houseId
          )[0].dataValues,
        };
      })
    );
    res
      .send(
        JSON.stringify({
          bookings,
          houses,
        })
      )
      .sendStatus(200);
  } catch (err) {
    console.log(err);
  }
});

router.get("/host/list/:userId", requireAuth, async (req, res, next) => {
  try {
    const { userId } = req.params;
    const user = await User.findOne({
      where: {
        id: userId,
      },
    });
    const houses = await House.findAll({
      where: {
        host: user.id,
      },
    });
    const houseIds = houses.map((house) => house.dataValues.id);
    const bookingData = await Booking.findAll({
      where: {
        reserved: true,
        houseId: {
          [Op.in]: houseIds,
        },
        endDate: {
          [Op.gte]: new Date(),
        },
      },
      order: [["startDate", "ASC"]],
    });
    const bookings = await Promise.all(
      bookingData.map(async (book) => {
        return {
          booking: book.dataValues,
          house: houses.filter(
            (house) => house.dataValues.id === book.dataValues.houseId
          )[0].dataValues,
        };
      })
    );
    res.send(
      JSON.stringify({
        bookings,
        houses,
      })
    );
  } catch (error) {
    console.log(error);
  }
});

router.post("/host/new", async (req, res) => {
  try {
    const houseData = req.body;
    const user = req.headers.user;
    const userInfo = await User.findOne({
      where: {
        email: user,
      },
    });
    houseData.host = userInfo.id;
    houseData.description = sanitizeHtml(houseData.description, {
      allowedTags: ["b", "i", "em", "strong", "p", "br"],
    });
    const newHouse = await House.create(houseData);
    res.writeHead(200, {
      "Content-Type": "application/json",
    });
    res.end(JSON.stringify({ status: "success", message: "ok" }));
  } catch (error) {
    console.log(error);
  }
});

router.post("/host/edit", async (req, res, next) => {
  try {
    const houseData = req.body;
    const { user } = req.headers;
    const host = await User.findOne({
      where: {
        email: user,
      },
    });

    const house = await House.findByPk(houseData.id);

    if (host.id !== house.dataValues.host) {
      res.writeHead(403, {
        "Content-Type": "application/json",
      });
      res.end(
        JSON.stringify({
          status: "error",
          message: "Unauthorized",
        })
      );

      return;
    }
    houseData.description = sanitizeHtml(houseData.description, {
      allowedTags: ["b", "i", "em", "strong", "p", "br"],
    });
    House.update(houseData, {
      where: {
        id: houseData.id,
      },
    });
    res.end(JSON.stringify({ status: "success", message: "ok" }));
  } catch (error) {
    console.log(error);
  }
});

router.post("/upload", upload.single("file"), (req, res, next) => {
  try {
    if (!req.file) {
      res.status(500);
      return next(err);
    }

    const url = req.protocol + "://" + "localhost:4000";
    const path = req.file.path.slice(6);
    const fileUrl = url + "/upload" + path;
    res.json({
      fileUrl: fileUrl,
    });
  } catch (error) {
    console.log(error);
  }
});
module.exports = router;
