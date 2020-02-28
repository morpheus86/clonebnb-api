"strict mode";

const handleSignin = async (db, user, bcrypt, req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return Promise.reject("Incorrect form submission");
  }
  //select email and password from login
  const userLog = await db.findAll({
    where: {
      email
    }
  });

  //make sure the data receive match the bcrypt password
  const isValid = await bcrypt.compareSync(password, userLog[0].password);
  if (isValid) {
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
