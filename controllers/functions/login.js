"strict mode";
// const UserLogin = require("../../models/login.model")

const handleSignin = async (db, user, req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return Promise.reject("Incorrect form submission");
  }
  //select email and password from login
  const userLog = await db.findOne({
    where: {
      email
    }
  });

  const isPasswordValid = userLog.isPasswordValid(password);

  console.log("isValid", isPasswordValid);
  if (isPasswordValid) {
    //grab the user Info and return it
    const userInfo = await user.findOne({
      where: {
        email
      }
    });
    res.send(userInfo);
  } else {
    Promise.reject("wrong credential");
  }
};
module.exports = {
  handleSignin
};
