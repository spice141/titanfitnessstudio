const Customer = require("../models/customer.model.js");
var validatorUtil = require("../utilities/userTokenValidator.js");

exports.create = (req, res) => {
  // Validate request
  validatorUtil.validateUserToken(req,res);
  if (!req.body) {
    res.status(400).send({
      message: "Content cannot be empty!"
    });
  }

  // Create a Customer
  const customer = new Customer({
    NAME : req.body.NAME,
    DOB : req.body.DOB,
    PHONE : req.body.PHONE,
    EMAIL : req.body.EMAIL,
    ADDRESS : req.body.ADDRESS,
    REFERENCE : req.body.REFERENCE,
    IMAGE_PATH : req.body.IMAGE_PATH,
    //GYM_PROFILE_ID : req.body.GYM_PROFILE_ID,
    PASSWORD : req.body.PASSWORD,
    STATUS : req.body.STATUS
  });

  // Save Customer in the database
  Customer.create(customer,req.decoded,(err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Customer."
      });
    else res.send(data);
  });
};


// Retrieve all Customers from the database.
exports.findAll = (req,res) => {
  validatorUtil.validateUserToken(req,res);
  Customer.getAll(req.body,req.decoded,(err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving customers."
      });
    else res.send(data);
  });
};

// Find a single Customer with a customerId
exports.findOne = (req, res) => {
  validatorUtil.validateUserToken(req,res);
  Customer.findById(req.params.id,req.decoded,(err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `No Customer found with id ${req.body.ID}.`
        });
      } else {
        res.status(500).send({
          message: "Error retrieving Customer with id " + req.body.ID
        });
      }
    } else res.send(data);
  });
};

// Update a Customer identified by the customerId in the request
exports.update = (req, res) => {
  // Validate Request
  validatorUtil.validateUserToken(req,res);
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
  }

  Customer.updateById(req.body.ID,new Customer(req.body),req.decoded,(err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `No Customer found with id ${req.body.ID}.`
        });
      } else {
        res.status(500).send({
          message: "Error updating Customer with id " + req.body.ID
        });
      }
    } else res.send(data);
  });
};

/*
// Delete a Customer with the specified customerId in the request
exports.delete = (req, res) => {
  Customer.remove(req.params.customerId, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found Customer with id ${req.params.customerId}.`
        });
      } else {
        res.status(500).send({
          message: "Could not delete Customer with id " + req.params.customerId
        });
      }
    } else res.send({ message: `Customer was deleted successfully!` });
  });
};

// Delete all Customers from the database.
exports.deleteAll = (req, res) => {
  Customer.removeAll((err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all customers."
      });
    else res.send({ message: `All Customers were deleted successfully!` });
  });
};
*/

