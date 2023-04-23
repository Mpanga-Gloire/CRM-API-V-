const User = require("../models/user.model");
const bycrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const secretConfig = require("../configs/auth.configs");
/**
 * Signup API
 * **/

exports.singup = async (req, res) => {
  const userTypeReq = req.body.userType;
  let userStatusReq = "APPROVED";

  if (userTypeReq == "ENGINEER") {
    userStatusReq = "PENDIND";
  }

  const userObj = {
    name: req.body.name,
    userId: req.body.userId,
    email: req.body.email,
    password: bycrypt.hashSync(req.body.password, 8),
    userType: userTypeReq,
    userStatus: userStatusReq,
  };

  try {
    const user = await User.create(userObj);

    res.status(200).send({
      name: user.name,
      userId: user.userId,
      email: user.email,
      userType: user.userType,
      userStatus: user.userStatus,
    });
  } catch (err) {
    console.log("Error creating User", err.message);
    res.status(500).send({
      message: "Internal server error",
    });
  }
};

exports.signin = async (req, res) => {
  const user = await User.findOne({ userId: req.body.userId });

  if (user == null) {
    return res.status(400).send({
      message: "UserId doesn't exist.",
    });
  }

  if (user.userStatus != "APPROVED") {
    return res.status(200).send({
      message: `Can't login with status as ${user.userStatus}`,
    });
  }

  if (!bycrypt.compareSync(req.body.password, user.password)) {
    return res.status(200).send({
      message: "Invalid password",
    });
  }

  /**
   * Create token and send to user**/

  const token = jwt.sign({ id: user.userId }, secretConfig.secret, {
    expiresIn: 5000,
  });

  res.status(200).send({
    name: user.name,
    userId: user.userId,
    email: user.email,
    userType: user.userType,
    userStatus: user.userStatus,
    accessToken: token,
  });
};
