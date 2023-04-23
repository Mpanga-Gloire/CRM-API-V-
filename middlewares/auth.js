const jwt = require("jsonwebtoken");
const secret = require("../configs/auth.configs");
const User = require("../models/user.model");

exports.verifyToken = (req, res, next) => {
  let token = req.headers["x-access-token"];

  if (!token) {
    return res.status(403).send({
      message: "No token provided",
    });
  }

  jwt.verify(token, secret.secret, (err, decoded) => {
    if (err) {
      return res.status(401).send({
        message: "Unauthorized",
      });
    }
    req.userId = decoded.id;
    next();
  });
};

exports.isAdmin = async (req, res, next) => {
  const user = await User.findOne({
    userId: req.userId,
  });

  if (user && user.userType == "ADMIN") {
    next();
  } else {
    return res.status(403).send({
      message: "Require Admin role to access this .",
    });
  }
};

exports.checkUserType = async (req, res, next) => {
  const user = await User.findOne({
    userId: req.userId,
  });

  if (user && user.userType == "ADMIN") {
    next();
  } else if (user.userType == "CUSTOMER" || user.userType == "ENGINEER") {
    if (req.id == User.userId) {
      next();
    } else {
      return res.status(403).send({
        message: "You are not the owner of this account",
      });
    }
  } else {
    return res.status(403).send({
      message: "Require Admin role to access this .",
    });
  }
};
