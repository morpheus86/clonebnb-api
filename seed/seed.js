"use strict";

const { User, UserLogin, db } = require("../models");

const usersLogin = [
  // {
  //   email: "a@a.com",
  //   password: "a"
  // }
];
const users = [
  // {
  //   name: "a",
  //   lastName: "b",
  //   email: "a@a.com"
  // }
];

const seed = async () => {
  await db.sync({ force: true });
  console.log("db synced");
  const user = await Promise.all(users.map(user => User.create(user)));
  const login = await Promise.all(usersLogin.map(log => UserLogin.create(log)));
  console.log(`seeded ${user.length}`);
  console.log(`seeded ${login.length}`);
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
