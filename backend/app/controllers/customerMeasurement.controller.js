const CustomerMeasurement = require("../models/customerMeasurement.model.js");
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
  const customerMeasurement = new CustomerMeasurement({
    CUSTOMER_PROFILE_ID : req.body.CUSTOMER_PROFILE_ID,
    WEIGHT : req.body.WEIGHT,
    HEIGHT : req.body.HEIGHT,
    SHOULDER : req.body.SHOULDER,
    CHEST : req.body.CHEST,
    ARMS : req.body.ARMS,
    ABS : req.body.ABS,
    THIGH : req.body.THIGH
  });

  // Save Customer Measurement in the database
  CustomerMeasurement.create(customerMeasurement,req.decoded,(err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Customer Measurement."
      });
    else res.send(data);
  });
};


// Retrieve all Customers from the database.
exports.findAll = (req,res) => {
  validatorUtil.validateUserToken(req,res);
  CustomerMeasurement.getAll(req.body,req.decoded,(err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving Customer Measurements."
      });
    else res.send(data);
  });
};



// Update a Customer identified by the customerId in the request
exports.update = (req, res) => {
  validatorUtil.validateUserToken(req,res);
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
  }

  CustomerMeasurement.updateById(req.body.ID,new CustomerMeasurement(req.body),req.decoded,(err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `No Customer found with id ${req.body.ID}.`
        });
      } else {
        res.status(500).send({
          message: "Error updating Customer Measurement with id " + req.body.ID
        });
      }
    } else res.send(data);
  });
};

