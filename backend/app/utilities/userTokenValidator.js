var jwt    = require('jsonwebtoken'); 
var config = require('../config/secret.config'); 

module.exports = {
     validateUserToken : function (req,res){
        var token =req.headers['x-access-token']
        if (token) {
          jwt.verify(token, config.secret, (err, decoded)=> {
            if (err) {
              res.status(403).send({ success: false, message: "Failed to authenticate user." })
            } else {
              req.decoded = decoded
            }
          })
        } else {
          res.status(403).send({ success: false, message: "No Token Provided." })
        }
      }
}
