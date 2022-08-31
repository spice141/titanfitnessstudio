const sql = require("./db.js");

// constructor
const Customer = function(customer) {
  this.NAME = customer.NAME;
  this.DOB = customer.DOB;
  this.PHONE = customer.PHONE;
  this.EMAIL = customer.EMAIL;
  this.ADDRESS = customer.ADDRESS;
  this.REFERENCE = customer.REFERENCE;
  this.IMAGE_PATH = customer.IMAGE_PATH;
  //this.GYM_PROFILE_ID = customer.GYM_PROFILE_ID;
  this.PASSWORD = customer.PASSWORD;
  this.STATUS = customer.STATUS;
};


Customer.create = (newCustomer,decodedData,result) => {
  newCustomer.GYM_PROFILE_ID = decodedData.GYM_PROFILE_ID;
  newCustomer.STATUS = true;
  sql.query("INSERT INTO customer_profile SET ?", newCustomer, (err, res) => {
    if (err) {
      result(err, null);
      return;
    }
    result(null, { id: res.insertId, ...newCustomer });
  });
};

Customer.findById = (customerId,decodedData,result) => {
  sql.query(`SELECT * FROM customer_profile WHERE ID = ${customerId} AND GYM_PROFILE_ID = ${decodedData.GYM_PROFILE_ID}`, (err, res) => {
    if (err) {
      result(err, null);
      return;
    }
    if (res.length) {
      result(null, res[0]);
      return;
    }
    // not found Customer with the id
    result({ kind: "not_found" }, null);
  });
};

Customer.getAll =(req,decodedData,result) =>  {
  let queryText = `SELECT IMAGE_PATH,ID,NAME,DOB,PHONE,STATUS FROM customer_profile`;
  if(req){
    queryText = queryText+` WHERE GYM_PROFILE_ID = ${decodedData.GYM_PROFILE_ID}`;
  }
  if(req.ID){
    queryText = queryText+` AND ID = '${req.ID}'`;
  }
  if(req.NAME){
    queryText = queryText+` AND NAME LIKE '%${req.NAME}%'`;
  }
  if(req.DOB){
    queryText = queryText+` AND DOB = '${req.DOB}'`;
  }
  if(req.PHONE){
    queryText = queryText+` AND PHONE = '${req.PHONE}'`;
  }
  //cursor config
  queryText = queryText+ ` ORDER BY ID DESC LIMIT ${req.CURRENT_POS ? req.CURRENT_POS : 0 },${req.COUNT ? req.COUNT : 10}`;
  
  
  sql.query(queryText, (err, res) => {
    if (err) {
      result(err,null);
      return;
    }
    result(null, {"data": res});
  });
};

Customer.updateById = (id, customer,decodedData,result) => {
  sql.query(
    `UPDATE customer_profile SET NAME = '${customer.NAME}', DOB = '${customer.DOB}', PHONE = '${customer.PHONE}', EMAIL = '${customer.EMAIL}', ADDRESS = '${customer.ADDRESS}', REFERENCE = '${customer.REFERENCE}', IMAGE_PATH = '${customer.IMAGE_PATH}', PASSWORD = '${customer.PASSWORD}', STATUS = '${customer.STATUS}' WHERE ID = ${id} AND GYM_PROFILE_ID = ${decodedData.GYM_PROFILE_ID}`,
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

/*Customer.remove = (id, result) => {
  sql.query("DELETE FROM customer_profile WHERE ID = ?", id, (err, res) => {
    if (err) {
      result(err,null);
      return;
    }

    if (res.affectedRows == 0) {
      // not found Customer with the id
      result({ kind: "not_found" }, null);
      return;
    }
    result(null, res);
  });
};

Customer.removeAll = result => {
  sql.query("DELETE FROM customer_profile", (err, res) => {
    if (err) {
      result(err, null);
      return;
    }
    result(null, res);
  });
};*/

module.exports = Customer;