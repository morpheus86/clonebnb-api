"use strict";

const handleRegister = async (
  req,
  res,
  next,
  userTable,
  loginTable,
  bcrypt
) => {
  try {
    const { email, name, password, authPassword } = req.app.use(
      bodyParser.json()
    );
    if (!email || !name || !password || !lastName) {
      return res.status(400).json("incorrect form submission");
    }
    if (password !== authPassword) {
      return res.status(400).json("password does not match");
    }
    //we are going to create the new user and insert it in both table user and login with the proper credentials
    const hash = await bcrypt.hashSync(password);
    await loginTable.create({
      hash,
      email
    });
    await userTable.create({
      name,
      lastName,
      email
    });
    res.json(newUser);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  handleRegister
};
