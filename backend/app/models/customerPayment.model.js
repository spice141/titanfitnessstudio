const sql = require("./db.js");

// constructor
const CustomerPayment = function(customer) {
  this.CUSTOMER_PROFILE_ID = customer.CUSTOMER_PROFILE_ID;
  this.PAYMENT_TYPE = customer.PAYMENT_TYPE;
  this.PAYMENT_AMOUNT = customer.PAYMENT_AMOUNT;
  this.EFFECTIVE_DATE = customer.EFFECTIVE_DATE;
  this.END_DATE = customer.END_DATE;
  this.PAYMENT_DATE = customer.PAYMENT_DATE;
  this.PAYMENT_BALANCE = customer.PAYMENT_BALANCE;
};


CustomerPayment.create = (newCustomerPayment,decodedData,result) => {
  sql.query("INSERT INTO customer_payment_log SET ?", newCustomerPayment, (err, res) => {
    if (err) {
      result(err, null);
      return;
    }
    result(null, { id: res.insertId, ...newCustomerPayment });
  });
};

CustomerPayment.getAll =(req,decodedData,result) =>  {
  let queryText = `SELECT * FROM customer_payment_log WHERE CUSTOMER_PROFILE_ID = ${req.CUSTOMER_PROFILE_ID} ORDER BY ID DESC LIMIT 0,12`;
  sql.query(queryText, (err, res) => {
    if (err) {
      result(err,null);
      return;
    }
    result(null, {"data": res});
  });
};

CustomerPayment.findAllPendingPayments =(req,decodedData,result) =>  {
    let queryText = `select t.CUSTOMER_PROFILE_ID,tm.NAME, t.END_DATE, t.PAYMENT_AMOUNT, t.PAYMENT_TYPE
    from customer_payment_log t
    inner join (
        select customer_payment_log.CUSTOMER_PROFILE_ID, max(customer_payment_log.END_DATE) as MaxDate, customer_profile.NAME
        from customer_payment_log,customer_profile where customer_payment_log.CUSTOMER_PROFILE_ID = customer_profile.ID AND customer_profile.STATUS = 1
        group by CUSTOMER_PROFILE_ID
    ) tm on t.CUSTOMER_PROFILE_ID = tm.CUSTOMER_PROFILE_ID and t.END_DATE = tm.MaxDate and t.END_DATE < current_date()`;
    if(req.CUSTOMER_PROFILE_ID){
        queryText = queryText+` AND t.CUSTOMER_PROFILE_ID = '${req.CUSTOMER_PROFILE_ID}'`;
    }
    //cursor config
    queryText = queryText+ ` LIMIT ${req.CURRENT_POS ? req.CURRENT_POS : 0 },${req.COUNT ? req.COUNT : 10}`;
    sql.query(queryText, (err, res) => {
      if (err) {
        result(err,null);
        return;
      }
      result(null, {"data": res});
    });
};

CustomerPayment.getPaymentHistory =(req,decodedData,result) =>  {
  let queryText = `SELECT IMAGE_PATH,CUSTOMER_PROFILE_ID, NAME, PHONE, PAYMENT_AMOUNT, PAYMENT_DATE, EFFECTIVE_DATE, END_DATE FROM customer_profile,customer_payment_log 
	WHERE customer_profile.ID = customer_payment_log.CUSTOMER_PROFILE_ID AND MONTH(PAYMENT_DATE) = '${req.MONTH}' AND YEAR(PAYMENT_DATE) = '${req.YEAR}'`;
  sql.query(queryText, (err, res) => {
    if (err) {
      result(err,null);
      return;
    }
    result(null, {"data": res});
  });
};

CustomerPayment.getPaymentHistoryTotal =(req,decodedData,result) =>  {
  let queryText = `SELECT SUM(PAYMENT_AMOUNT) AS TOTAL FROM customer_payment_log 
	WHERE MONTH(PAYMENT_DATE) = '${req.MONTH}' AND YEAR(PAYMENT_DATE) = '${req.YEAR}'`;
  sql.query(queryText, (err, res) => {
    if (err) {
      result(err,null);
      return;
    }
    result(null, {"data": res});
  });
};

CustomerPayment.updateById = (id, customerPayment,decodedData,result) => {
  sql.query(
    `UPDATE customer_payment_log SET PAYMENT_TYPE = '${customerPayment.PAYMENT_TYPE}', PAYMENT_AMOUNT = '${customerPayment.PAYMENT_AMOUNT}', EFFECTIVE_DATE = '${customerPayment.EFFECTIVE_DATE}', END_DATE = '${customerPayment.END_DATE}', PAYMENT_DATE = '${customerPayment.PAYMENT_DATE}' WHERE ID = ${id}`,
     (err, res) => {
      if (err) {
        result(err,null);
        return;
      }
      if (res.affectedRows == 0) {
        // not found customer payment with the id
        result({ kind: "not_found" }, null);
        return;
      }
      result(null, { id: id, ...customerPayment });
    }
  );
};

module.exports = CustomerPayment;