const userModel = require("../models/user.model");
const objectConverter = require("../utils/objectCoverter");

/**
 * Fetch list of all the users [Later we will modify if needed]**/

exports.findAll = async (req, res) => {
  try {
    let userQuery = {};
    let userTypeReq = req.query.userType;
    let userStatusReq = req.query.userStatus;

    if (userTypeReq) {
      userQuery.userType = userTypeReq;
    }

    if (userStatusReq) {
      userQuery.userStatus = userStatusReq;
    }

    const users = await userModel.find(userQuery);
    res.status(200).send(objectConverter.userResponse(users));
  } catch (err) {
    console.log(`Erro fetching data ${err}`);
    res.status(500).send({
      message: "Internal Server Error",
    });
  }
};

exports.findById = async (req, res) => {
  try {
    const user = await userModel.findOne({
      userId: req.params.id,
    });

    if (!user) {
      return res.status(200).send({
        message: `User with this ${req.params.id} does not exist`,
      });
    }

    var userResponseObj = {
      name: user.name,
      userId: user.userId,
      email: user.email,
      userType: user.userType,
      userStatus: user.userStatus,
    };

    return res.status(200).send(userResponseObj);
  } catch (err) {
    return res.status(500).send({
      message: "Internal server error",
    });
  }
};

exports.update = async (req, res) => {
  try {
    const user = await userModel.findOne({
      userId: req.params.id,
    });

    if (!user) {
      return res.status(200).send({
        message: `User with this ${req.params.id} does not exist`,
      });
    }

    user.name = req.body.name ? req.body.name : user.name;
    user.userStatus = req.body.userStatus
      ? req.body.userStatus
      : user.userStatus;
    user.userType = req.body.userType ? req.body.userType : user.userType;

    const newUser = await user.save();

    var userResponseObj = {
      name: newUser.name,
      userId: newUser.userId,
      email: newUser.email,
      userType: newUser.userType,
      userStatus: newUser.userStatus,
    };

    return res.status(200).send(userResponseObj);
  } catch (err) {
    return res.status(500).send({
      message: "Internal server error",
    });
  }
};
