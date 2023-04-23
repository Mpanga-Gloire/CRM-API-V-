const Ticket = require("../models/ticket.model");
const userModel = require("../models/user.model");
const User = require("../models/user.model");
const objectCoverter = require("../utils/objectCoverter");
const CONSTANTS = require("../utils/constants");

exports.createTicket = async (req, res) => {
  const ticketObj = {
    title: req.body.title,
    description: req.body.description,
    ticketPriority: req.body.ticketPriority,
    status: req.body.status,
    reporter: req.userId,
  };

  try {
    /**
     *Logic to find Engineer in the Approved Status
     * **/

    const engineer = await User.findOne({
      userType: CONSTANTS.userTypes.engineer,
      userStatus: CONSTANTS.userStatus.approved,
    });

    ticketObj.assignee = engineer.userId;

    const ticket = await Ticket.create(ticketObj);

    /***
     * Update customer and Engineer data
     */
    if (ticket) {
      const user = await User.findOne({
        userId: req.userId,
      });

      //Customer
      user.ticketscreated.push(ticket._id);
      await user.save();

      //Engineer
      engineer.ticketsAssigned.push(ticket._id);
      await engineer.save();
    }

    res.status(200).send(objectCoverter.ticketResponse(ticket));
  } catch (err) {
    console.log("Error while creating the ticket", err);
    res.status(500).send({
      message: "Internal server error",
    });
  }
};

exports.updateTicket = async (req, res) => {
  const ticketId = req.params.id;

  const ticket = await Ticket.findOne({ _id: ticketId });

  if (!ticket) {
    return res.status(400).send({
      message: `Ticket with the ${ticketId} not present`,
    });
  }

  const savedUser = await userModel.findOne({ userId: req.userId });

  if (
    ticket.reporter == req.userId ||
    ticket.assignee == req.userId ||
    savedUser.userType == CONSTANTS.userTypes.admin
  ) {
    ticket.title = req.body.title != undefined ? req.body.title : ticket.title;
    ticket.description =
      req.body.description != undefined
        ? req.body.description
        : ticket.description;
    ticket.ticketPriority =
      req.body.ticketPriority != undefined
        ? req.body.ticketPriority
        : ticket.ticketPriority;
    ticket.status =
      req.body.status != undefined ? req.body.status : ticket.status;
    ticket.assignee =
      req.body.assignee != undefined ? req.body.assignee : ticket.assignee;

    console.log(ticket);

    const updatedTicked = await ticket.save();

    res.status(200).send(objectCoverter.ticketResponse(updatedTicked));
  } else {
    return res.status(404).send({
      message:
        "Ticket can only be updated by a owner of the ticket or engineer and Admin",
    });
  }
};

exports.getAllTickets = async (req, res) => {
  /**
   * ADMIN should get all the tickets + can apply filter
   *
   * CUSTOMER should only get tickets created by him.
   * ENGINEER should only get tickets created by him.
   */

  const queryObj = {};

  if (req.query.status != undefined) {
    queryObj.status = { $regex: new RegExp(req.query.status), $options: "i" };
  }

  const savedUser = await userModel.findOne({ userId: req.userId });

  if (savedUser.userType == CONSTANTS.userTypes.engineer) {
    queryObj.assignee = req.userId;
  } else if (savedUser.userType == CONSTANTS.userTypes.customer) {
    queryObj.reporter = req.userId;
  } else {
    //ADMIN - Do nothing
  }

  const tickets = await Ticket.find(queryObj);

  res.status(200).send(tickets);
};
