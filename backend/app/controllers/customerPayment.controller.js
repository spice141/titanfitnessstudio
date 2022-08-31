const CustomerPayment = require("../models/customerPayment.model.js");
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
  const customerPayment = new CustomerPayment({
    CUSTOMER_PROFILE_ID : req.body.CUSTOMER_PROFILE_ID,
    PAYMENT_TYPE : req.body.PAYMENT_TYPE,
    PAYMENT_AMOUNT : req.body.PAYMENT_AMOUNT,
    EFFECTIVE_DATE : req.body.EFFECTIVE_DATE,
    END_DATE : req.body.END_DATE,
    PAYMENT_DATE : req.body.PAYMENT_DATE,
    PAYMENT_BALANCE : req.body.PAYMENT_BALANCE
  });

  // Save Customer Payment in the database
  CustomerPayment.create(customerPayment,req.decoded,(err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the customer payment."
      });
    else res.send(data);
  });
};


// Retrieve all Customer Payments from the database.
exports.findAll = (req,res) => {
  validatorUtil.validateUserToken(req,res);
  CustomerPayment.getAll(req.body,req.decoded,(err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving customers."
      });
    else res.send(data);
  });
};

// Retrieve all Pending Customer Payments from the database.
exports.findAllPendingPayments = (req,res) => {
    validatorUtil.validateUserToken(req,res);
    CustomerPayment.findAllPendingPayments(req.body,req.decoded,(err, data) => {
      if (err)
        res.status(500).send({
          message:
            err.message || "Some error occurred while retrieving customers."
        });
      else res.send(data);
    });
  };

// Retrieve all  Customer Payments from the database.
exports.getPaymentHistory = (req,res) => {
  validatorUtil.validateUserToken(req,res);
  CustomerPayment.getPaymentHistory(req.body,req.decoded,(err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving customers."
      });
    else res.send(data);
  });
};

// Retrieve all Total of  Customer Payments from the database.
exports.getPaymentHistoryTotal = (req,res) => {
  validatorUtil.validateUserToken(req,res);
  CustomerPayment.getPaymentHistoryTotal(req.body,req.decoded,(err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving customers."
      });
    else res.send(data);
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

  CustomerPayment.updateById(req.body.ID,new CustomerPayment(req.body),req.decoded,(err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `No Customer Payment found with id ${req.body.ID}.`
        });
      } else {
        res.status(500).send({
          message: "Error updating Customer Payment with id " + req.body.ID
        });
      }
    } else res.send(data);
  });
};




