module.exports = app => {
  const users = require("../controllers/authenticate.controller.js");
  const customers = require("../controllers/customer.controller.js");
  const customerActivity = require("../controllers/customerActivity.controller.js");
  const customerPayment = require("../controllers/customerPayment.controller.js");
  const customerMeasurement = require("../controllers/customerMeasurement.controller.js");
 
  // Login
  app.post("/login", users.login);

  // Create a new Customer
  app.post("/customers", customers.create);

  // Retrieve all Customers
  app.get("/customers", customers.findAll);

  // Retrieve all Customers
  app.post("/searchCustomers", customers.findAll);

  // Retrieve a single Customer with customerId
  app.get("/customers/:id", customers.findOne);

  // Update a Customer with customerId
  app.put("/customers", customers.update);

  // Delete a Customer with customerId
  //app.delete("/customers/:customerId", customers.delete);

  // Delete all Customer
  //app.delete("/customers", customers.deleteAll);

  // Create a new Customer aCTIVITY
  app.post("/customerActivity", customerActivity.createActivity);
  

  // Update a Customer Activity  with customer activity Id
  app.put("/customerActivity", customerActivity.updateActivity);

  //getDailyCustomerActivity
  app.post("/customerActivity/daily", customerActivity.getDailyCustomerActivity);

  //getMonthlyCustomerActivity
  app.post("/customerActivity/monthly", customerActivity.getMonthlyCustomerActivity);

  //getCustomerActivityLog
  app.post("/customerActivity/getCustomerActivityLog", customerActivity.getCustomerActivityLog);

  //autocheckout
  app.post("/customerActivity/autocheckout", customerActivity.autocheckout);

  // Create a new Customer Payment
  app.post("/customerPayment", customerPayment.create);

  // Retrieve all Customer Payment
  app.post("/getCustomerPayments", customerPayment.findAll);

  // Retrieve all Pending Customer Payments
  app.post("/customerPayment/pendingPayments", customerPayment.findAllPendingPayments);

  // Retrieve all  Payments
  app.post("/customerPayment/paymentHistory", customerPayment.getPaymentHistory);

  // Retrieve sum of all  Payments
  app.post("/customerPayment/paymentHistoryTotal", customerPayment.getPaymentHistoryTotal);

  // Update a Customer Payment with paymentId
  app.put("/customerPayment", customerPayment.update);

  // Create a new Customer Measurement
  app.post("/customerMeasurement", customerMeasurement.create);

  // Retrieve all Customer Measurement
  app.post("/getCustomerMeasurements", customerMeasurement.findAll);

  // Update a Customer Measurement with Id
  app.put("/customerMeasurement", customerMeasurement.update);

};
