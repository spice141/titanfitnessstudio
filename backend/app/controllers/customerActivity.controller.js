const CustomerActivity = require("../models/customerActivity.model.js");
var validatorUtil = require("../utilities/userTokenValidator.js");

// Create and Save a new Customer activity
exports.createActivity = (req, res) => {
  // Validate request
  validatorUtil.validateUserToken(req,res);
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
  }

  // Create a Customer Activity
  const customerActivity = new CustomerActivity({
    // IN_TIME: req.body.IN_TIME,
    // OUT_TIME: req.body.OUT_TIME,
    CUSTOMER_PROFILE_ID: req.body.CUSTOMER_PROFILE_ID
  });

  // Save Customer Activity in the database
  CustomerActivity.createActivity(customerActivity, (err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Customer Activity."
      });
    else res.send(data);
  });
};

// Update a Customer Activity identified by the customer activity Id in the request
exports.updateActivity = (req, res) => {
  // Validate Request
  validatorUtil.validateUserToken(req,res);
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
  }

  CustomerActivity.updateById(
   new CustomerActivity(req.body),
    (err, data) => {
      if (err) {
        if (err.kind === "not_found") {
          res.status(404).send({
            message: `Update Operation Failed`
          });
        } else {
          res.status(500).send({
            message: "Update Operation Failed"
          });
        }
      } else res.send(data);
    }
  );
};

// Retrieve Daily Customer Activity.
exports.getDailyCustomerActivity = (req, res) => {
  validatorUtil.validateUserToken(req,res);
  CustomerActivity.getDailyCustomerActivity(req.body,req.decoded,(err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving customer activity"
      });
    else res.send(data);
  });
};

// Retrieve Monthly Customer Activity.
exports.getMonthlyCustomerActivity = (req, res) => {
  validatorUtil.validateUserToken(req,res);
  CustomerActivity.getMonthlyCustomerActivity(req.body,req.decoded,(err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving customer activity"
      });
    else res.send(data);
  });
};

// Retrieve Customer Activity Log.
exports.getCustomerActivityLog = (req, res) => {
  validatorUtil.validateUserToken(req,res);
  CustomerActivity.getCustomerActivityLog(req.body,req.decoded,(err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving customer activity"
      });
    else res.send(data);
  });
};

// Retrieve Customer Activity Log.
exports.autocheckout = (req, res) => {
  validatorUtil.validateUserToken(req,res);
  CustomerActivity.autocheckout(req.body,req.decoded,(err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving customer activity"
      });
    else res.send(data);
  });
};



