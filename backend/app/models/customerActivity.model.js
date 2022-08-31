const sql = require("./db.js");

// constructor
const CustomerActivity = function(customerActivity) {
  // this.IN_TIME = customerActivity.IN_TIME;
  // this.OUT_TIME = customerActivity.OUT_TIME;
  this.CUSTOMER_PROFILE_ID = customerActivity.CUSTOMER_PROFILE_ID;
};

CustomerActivity.createActivity = (newCustomerActivity, result) => {
  sql.query(`INSERT INTO customer_activity_log SET CUSTOMER_PROFILE_ID = ${newCustomerActivity.CUSTOMER_PROFILE_ID}, IN_TIME = NOW() `, (err, res) => {
    if (err) {
      result(err, null);
      return;
    }
    result(null, { id: res.insertId, ...newCustomerActivity });
  });
};

CustomerActivity.updateById = (customerActivity, result) => {
  let customerActivityID = '';
  let IN_TIME= null;
  /*Get the correct record to checkout for the customer*/
  sql.query(`SELECT * FROM customer_activity_log WHERE CUSTOMER_PROFILE_ID = ${customerActivity.CUSTOMER_PROFILE_ID} AND OUT_TIME IS NULL AND IN_TIME IS NOT NULL ORDER BY IN_TIME DESC LIMIT 1 `, (err, res) => {
    if (err) {
      result(err, null);
      return;
    }
    if (res.length) {
      customerActivityID = res[0].ID;
      IN_TIME = res[0].IN_TIME;
      var d = new Date(IN_TIME);
      var date_format_str = d.getFullYear().toString()+"-"+((d.getMonth()+1).toString().length==2?(d.getMonth()+1).toString():"0"+(d.getMonth()+1).toString())+"-"+(d.getDate().toString().length==2?d.getDate().toString():"0"+d.getDate().toString())+" "+(d.getHours().toString().length==2?d.getHours().toString():"0"+d.getHours().toString())+":"+((parseInt(d.getMinutes())).toString().length==2?(parseInt(d.getMinutes())).toString():"0"+(parseInt(d.getMinutes())).toString())+":"+((parseInt(d.getSeconds())).toString().length==2?(parseInt(d.getSeconds())).toString():"0"+(parseInt(d.getSeconds())).toString());
      /*Update checkout date time for the record*/
      let queryText = `UPDATE customer_activity_log SET OUT_TIME = NOW(), DURATION = (SELECT TIMEDIFF(NOW(),'${date_format_str}') diff) WHERE ID = ${customerActivityID}`;
      sql.query(queryText,(err, res) => {
          if (err) {
            result(null, err);
            return;
          }
          if (res.affectedRows == 0) {
            // not found customerActivity with the id
            result({ kind: "not_found" }, null);
            return;
          }
          result(null, { id: customerActivityID, ...customerActivity });
      });
    }
    else{
      result({ kind: "not_found" }, null);
    }
   });
  
};

CustomerActivity.getDailyCustomerActivity =(req,decodedData,result) =>  {
  let queryText = `SELECT  customer_activity_log.*  FROM customer_activity_log,customer_profile WHERE customer_activity_log.CUSTOMER_PROFILE_ID = customer_profile.ID AND customer_profile.ID = ${req.CUSTOMER_PROFILE_ID} AND customer_profile.GYM_PROFILE_ID = ${decodedData.GYM_PROFILE_ID} AND IN_TIME >= CURDATE() AND IN_TIME < CURDATE() + INTERVAL 1 DAY`;
  sql.query(queryText, (err, res) => {
    if (err) {
      result(null, err);
      return;
    }
    result(null, {"data": res});
  });
};

CustomerActivity.getMonthlyCustomerActivity =(req,decodedData,result) =>  {
  let queryText = `SELECT customer_activity_log.*  FROM customer_activity_log,customer_profile WHERE customer_activity_log.CUSTOMER_PROFILE_ID = customer_profile.ID AND customer_profile.ID = ${req.CUSTOMER_PROFILE_ID} AND customer_profile.GYM_PROFILE_ID = ${decodedData.GYM_PROFILE_ID} AND MONTH(IN_TIME) = MONTH(CURRENT_DATE()) AND YEAR(IN_TIME) = YEAR(CURRENT_DATE()) ORDER BY ID DESC`;
  sql.query(queryText, (err, res) => {
    if (err) {
      result(null, err);
      return;
    }
    result(null, {"data": res});
  });
};

CustomerActivity.getCustomerActivityLog =(req,decodedData,result) =>  {
  let queryText = `SELECT cp.IMAGE_PATH, cal.CUSTOMER_PROFILE_ID, cp.NAME, cp.PHONE, cal.IN_TIME, cal.OUT_TIME, cal.DURATION, V.END_DATE FROM customer_activity_log cal, customer_profile cp
  INNER JOIN (SELECT *
  FROM customer_payment_log
  WHERE ID IN (
  SELECT MAX(ID)
  FROM customer_payment_log
  GROUP BY CUSTOMER_PROFILE_ID
  )) AS V ON cp.ID = V.CUSTOMER_PROFILE_ID 
  WHERE cp.ID = cal.CUSTOMER_PROFILE_ID AND YEAR(IN_TIME) = '${req.YEAR}' AND MONTH(IN_TIME) = '${req.MONTH}' AND DAY(IN_TIME) = '${req.DAY}'
  AND TIME(IN_TIME) BETWEEN '${req.START_TIME}' AND '${req.END_TIME}' ORDER BY cal.OUT_TIME ASC`;
  sql.query(queryText, (err, res) => {
    if (err) {
      result(null, err);
      return;
    }
    result(null, {"data": res});
  });
};

CustomerActivity.autocheckout =(req,decodedData,result) =>  {
  let queryText = `update customer_activity_log set OUT_TIME = DATE_ADD(IN_TIME, INTERVAL 1 HOUR) , DURATION = '01:00:00'  WHERE DATE(IN_TIME) = DATE(NOW()) AND OUT_TIME IS NULL`;
  sql.query(queryText, (err, res) => {
    if (err) {
      result(null, err);
      return;
    }
    result(null, {"data": res});
  });
};





module.exports = CustomerActivity;