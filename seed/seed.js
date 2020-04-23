"use strict";

const { User, UserLogin, db, House, Review } = require("../models");

const usersLogin = [
  {
    email: "a@a.com",
    password: "a"
  }
];
const users = [
  {
    name: "Anna",
    lastName: "Boulogne",
    email: "a@a.com"
  }
];

const houses = [
  {
    host: 1,
    picture:
      "https://content.api.news/v3/images/bin/9bd6b502fd2fa9b16dc10d09cc0feda6",
    type: "Entire house",
    town: "Ostuni",
    superhost: true,
    title: "Beautiful flat in Ostuni!",
    price: 50.0,
    superhost: true,
    description:
      "Spend a unforgettable holiday in the enchanting surroundings of the town of Cisternino (reachable from the near airports of Bari and Brindisi).<br>Trullo Edera offers a heaven of peace and tranquillity, set in an elevated position with a stunning view.<br> It's the perfect place if you like nature. You can stay under an olive tree reading a good book, you can have a walk in the small country streets or go to the nearest beaches.<br> You can even easily visit any of the sights in Apulia such as the caves of Castellana, the trulli of Alberobello, the baroque cities of Lecce and Martina Franca, the excavations of Egnazia, the zoosafari of Fasano, Castel del Monte with Frederick's castle, Grottaglie famous for its ceramics, Taranto, Brindisi and Lecce museums.<br>    Prices vary on period and are to be considered included: in-outcoming cleanings, towels, sheets, water, gas, electricity.",
    guests: 4,
    bedrooms: 1,
    beds: 2,
    baths: 1,
    wifi: true,
    kitchen: true,
    heating: true,
    freeParking: true,
    entirePlace: true
  },
  {
    host: 2,
    picture:
      "https://static.dezeen.com/uploads/2017/08/clifton-house-project-architecture_dezeen_hero-1.jpg",
    type: "Entire house",
    town: "Isla Mujeres",
    title: "The World Famous Seashell House ~ Casa Caracol",
    price: 50.0,
    superhost: false,
    description:
      "An incredible house which mirror amazing and look toward a view to kill for",
    guests: 4,
    bedrooms: 1,
    beds: 2,
    baths: 1,
    wifi: true,
    kitchen: true,
    heating: true,
    freeParking: true,
    entirePlace: true
  },
  {
    host: 1,
    picture:
      "https://assets.themortgagereports.com/wp-content/uploads/2017/12/How-to-Buy-a-House-with-Low-Income-This-Year.jpg",
    type: "Entire house",
    town: "Mujeres",
    title: "The World Famous House ~ Caracol",
    price: 100,
    superhost: false,
    description:
      "An incredible house which mirror amazing and look toward a view to kill for",
    guests: 4,
    bedrooms: 1,
    beds: 2,
    baths: 1,
    wifi: true,
    kitchen: true,
    heating: true,
    freeParking: true,
    entirePlace: true
  }
];
const reviews = [
  {
    houseId: 1,
    user: "Radhika",
    date: "August 2019",
    avatar:
      "https://a0.muscache.com/im/users/34403074/profile_pic/1432859567/original.jpg?aki_policy=profile_x_medium",
    comment:
      "We had an excellent stay at the trullo - everything was perfect, starting with Anna’s generosity to meet us in town so we wouldn’t lose our way, to the beautiful setting of the trullo, to the fresh eggs and tomatoes for our use, to Anna’s tips and suggestions for local"
  }
];
const seed = async () => {
  await db.sync({ force: true });
  console.log("db synced");
  const user = await Promise.all(users.map(user => User.create(user)));
  const login = await Promise.all(usersLogin.map(log => UserLogin.create(log)));
  const house = await Promise.all(houses.map(house => House.create(house)));
  const review = await Promise.all(reviews.map(rev => Review.create(rev)));
  console.log(`seeded ${user.length}`);
  console.log(`seeded ${login.length}`);
  console.log(`seeded ${house.length}`);
  console.log(`seeded ${review.length}`);

  console.log("Seeded Succesfully");
};

const runSeed = async () => {
  try {
    await seed();
  } catch (error) {
    console.error(error);
  } finally {
    await db.close();
    console.log("db connection is closed");
  }
};

runSeed();

module.exports = seed;
