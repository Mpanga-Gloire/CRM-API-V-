const userController = require("../controllers/user.controller");
const authMiddleware = require("../middlewares/auth");

module.exports = function (app) {
  app.get(
    "/crm/api/v1/users",
    [authMiddleware.verifyToken, authMiddleware.isAdmin],
    userController.findAll
  );

  app.get(
    "/crm/api/v1/users/:id",
    [authMiddleware.verifyToken, authMiddleware.isAdmin],
    userController.findById
  );

  app.put(
    "/crm/api/v1/users/:id",
    [authMiddleware.verifyToken, authMiddleware.checkUserType],
    userController.update
  );
};
