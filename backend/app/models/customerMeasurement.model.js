const sql = require("./db.js");

// constructor
const CustomerMeasurement = function(customer) {
  this.CUSTOMER_PROFILE_ID = customer.CUSTOMER_PROFILE_ID;
  this.WEIGHT = customer.WEIGHT;
  this.HEIGHT = customer.HEIGHT;
  this.SHOULDER = customer.SHOULDER;
  this.CHEST = customer.CHEST;
  this.ARMS = customer.ARMS;
  this.ABS = customer.ABS;
  this.THIGH = customer.THIGH;
};


CustomerMeasurement.create = (newCustomerMeasurement,decodedData,result) => {
  sql.query(`INSERT INTO customer_measurement_log SET WEIGHT = '${newCustomerMeasurement.WEIGHT}', HEIGHT = '${newCustomerMeasurement.HEIGHT}', SHOULDER = '${newCustomerMeasurement.SHOULDER}', CHEST = '${newCustomerMeasurement.CHEST}', ARMS = '${newCustomerMeasurement.ARMS}', ABS = '${newCustomerMeasurement.ABS}', THIGH = '${newCustomerMeasurement.THIGH}', CUSTOMER_PROFILE_ID = '${newCustomerMeasurement.CUSTOMER_PROFILE_ID}', ENTRY_DATE = current_date()`,(err, res) => {
    if (err) {
      result(err, null);
      return;
    }
    result(null, { id: res.insertId, ...newCustomerMeasurement });
  });
};


CustomerMeasurement.getAll =(req,decodedData,result) =>  {
  let queryText = `SELECT * FROM customer_measurement_log WHERE CUSTOMER_PROFILE_ID = ${req.CUSTOMER_PROFILE_ID} AND YEAR(ENTRY_DATE) = YEAR(CURRENT_DATE()) ORDER BY ID DESC`;
  sql.query(queryText, (err, res) => {
    if (err) {
      result(err,null);
      return;
    }
    result(null, {"data": res});
  });
};

CustomerMeasurement.updateById = (id, customer,decodedData,result) => {
  sql.query(
    `UPDATE customer_measurement_log SET WEIGHT = '${customer.WEIGHT}', HEIGHT = '${customer.HEIGHT}', SHOULDER = '${customer.SHOULDER}', CHEST = '${customer.CHEST}', ARMS = '${customer.ARMS}', ABS = '${customer.ABS}', THIGH = '${customer.THIGH}', CUSTOMER_PROFILE_ID = '${customer.CUSTOMER_PROFILE_ID}' WHERE ID = ${id}`,
     (err, res) => {
      if (err) {
        result(err,null);
        return;
      }
      if (res.affectedRows == 0) {
        // not found Customer with the id
        result({ kind: "not_found" }, null);
        return;
      }
      result(null, { id: id, ...customer });
    }
  );
};

module.exports = CustomerMeasurement;