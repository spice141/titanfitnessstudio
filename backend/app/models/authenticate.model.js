const sql = require("./db.js");
var jwt    = require('jsonwebtoken'); 
var config = require('../config/secret.config'); 

// constructor
const User = function(user) {
  this.USER_ID = user.USER_ID;
  this.PASSWORD = user.PASSWORD;
};

User.login = (USER_ID,PASSWORD,result) => {
  if(!USER_ID || !PASSWORD){
     //Login Failed
     result({ kind: "User ID and Password is Mandatory!" }, null);
  }
  let buff = new Buffer(PASSWORD, 'base64');
  let decryptedPwd =  buff.toString('ascii');;
  sql.query(`SELECT * FROM user_master WHERE ID = ${USER_ID} AND PASSWORD = '${decryptedPwd}'`, (err, res) => {
    if (err) {
      result(err, null);
      return;
    }
    if (res.length) {
        // Generate JWT and send in response
        const payload = {
            USER_ID: USER_ID,
            GYM_PROFILE_ID: res[0].GYM_PROFILE_ID
        };
        var token = jwt.sign(payload, config.secret, {
            expiresIn : '24h'
        });	
        return result(null, {"userToken":token})
    }
    else{
        //Login Failed
        result({ kind: "Login Failed" }, null);
    }
    });
};

module.exports = User;