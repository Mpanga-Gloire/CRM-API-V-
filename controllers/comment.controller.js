const Commnet = require("../models/comment.model");

exports.createComment = async (req, res) => {
  const commentReqObj = {
    content: req.body.content,
    ticketId: req.params.ticketId,
    commenterId: req.userId,
  };

  try {
    const comment = await Commnet.create(commentReqObj);

    res.status(200).send(comment);
  } catch (err) {
    console.log("Some error while creating comment");

    res.status(500).send({
      message: "Internal sever error",
    });
  }
};

exports.fetchComment = async (req, res) => {
  try {
    const comments = await Commnet.find({ tickedId: req.params.ticketId });

    res.status(200).send(comments);
  } catch (err) {
    console.log("Some error while creating comment");

    res.status(500).send({
      message: "Internal sever error",
    });
  }
};
