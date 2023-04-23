exports.validatedTicketReqBody = (req, res, next) => {
  if (!req.body.title) {
    return res.status(400).send({
      message: "Title is required",
    });
  }

  if (!req.body.description) {
    return res.status(400).send({
      message: "Description is required",
    });
  }

  next();
};
