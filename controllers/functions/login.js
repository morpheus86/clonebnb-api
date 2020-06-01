"strict mode";
const jwt = require("jsonwebtoken");
const redis = require("redis");
const bcrypt = require("bcryptjs");
//setUp redis Client
const redisClient = redis.createClient(process.env.REDIS_URL);

const handleSignin = async (db, user, req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return Promise.reject("Incorrect form submission");
    }
    //select email and password from login
    const userLog = await db.findOne({
      where: {
        email,
      },
    });
    console.log("userLog", userLog);
    if (!userLog) {
      return Promise.reject("User does not exist");
    }
    // Compare password entered and password stored in db
    const isPassword = async (password) => {
      return await bcrypt.compare(password, userLog.dataValues.password);
    };

    const isPasswordValid = await isPassword(password);

    console.log("isPasswordValid", isPasswordValid);

    if (isPasswordValid) {
      //grab the user Info and return it
      const userInfo = await user.findOne({
        where: {
          email,
        },
      });
      return userInfo;
    } else {
      return Promise.reject("wrong credential");
    }
  } catch (error) {
    console.log(error);
  }
};

const signinToken = (username) => {
  const jwtPayload = { username };
  return jwt.sign(jwtPayload, "JWT_SECRET_KEY", { expiresIn: "2 days" });
};

const setToken = (key, value) => Promise.resolve(redisClient.set(key, value));

const createSession = async (user, res) => {
  const { email, id } = user;
  const token = await signinToken(email);
  const set = await setToken(token, id);

  if (set) {
    return {
      success: true,
      userId: id,
      token,
      user,
    };
  } else {
    return Promise.reject("Token Problem");
  }
};

const getAuthTokenId = (req, res) => {
  const { authorization } = req.headers;
  return redisClient.get(authorization, (err, reply) => {
    if (err || !reply) return res.status(401).send("Unauthorized");
    return res.json({ id: reply });
  });
};

const signinAuthentication = async (db, user, req, res) => {
  const { authorization } = req.headers;
  if (authorization) {
    return getAuthTokenId(req, res);
  } else {
    const userInfo = await handleSignin(db, user, req);
    const session = await createSession(userInfo, res);
    res.json(session);
  }
};

const requireAuth = (req, res, next) => {
  try {
    const { authorization } = req.headers;
    if (!authorization) {
      return res.status(401).json("unauthorized");
    }
    return redisClient.get(authorization, (err, reply) => {
      if (err || !reply) {
        return res.status(401).json("unauthorized");
      }
      return next();
    });
  } catch (error) {
    console.log(error);
  }
};
module.exports = {
  signinAuthentication,
  requireAuth,
};
