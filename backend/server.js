const express = require("express");
const bodyParser = require("body-parser");
var jwt    = require('jsonwebtoken'); 
var config = require('./app/config/secret.config');
var multer = require('multer'); 
var DIR = 'C:/inetpub/wwwroot/assets/images';

const app = express();

// parse requests of content-type: application/json
app.use(bodyParser.json());

// parse requests of content-type: application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

app.use(function(req, res, next) { //allow cross origin requests
	res.setHeader("Access-Control-Allow-Methods", "POST, PUT, OPTIONS, DELETE, GET");
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, x-access-token");
	res.header("Access-Control-Expose-Headers", "x-access-token");
	res.header("Access-Control-Allow-Credentials", true);
	next();
});

// Middleware to verify token, it will be called everytime a request is sent to API
/*app.use('/customers',(req, res, next)=> {
  //var token = req.headers['x-access-token']
  var token = req.userToken;
  if (token) {
    jwt.verify(token, config.secret, (err, decoded)=> {
      if (err) {
        res.status(403).send({ success: false, message: "Failed to authenticate user." })
      } else {
        req.decoded = decoded
        next()
      }
    })
  } else {
    res.status(403).send({ success: false, message: "No Token Provided." })
  }
})

app.use('/customerActivity',(req, res, next)=> {
  var token = req.headers['x-access-token']
  //var token = req.params.token;
  if (token) {
    jwt.verify(token, config.secret, (err, decoded)=> {
      if (err) {
        res.status(403).send({ success: false, message: "Failed to authenticate user." })
      } else {
        req.decoded = decoded
        next()
      }
    })
  } else {
    res.status(403).send({ success: false, message: "No Token Provided." })
  }
})

app.use('/customerPayment',(req, res, next)=> {
  var token = req.headers['x-access-token']
  //var token = req.params.token;
  if (token) {
    jwt.verify(token, config.secret, (err, decoded)=> {
      if (err) {
        res.status(403).send({ success: false, message: "Failed to authenticate user." })
      } else {
        req.decoded = decoded
        next()
      }
    })
  } else {
    res.status(403).send({ success: false, message: "No Token Provided." })
  }
})

app.use('/customerMeasurement',(req, res, next)=> {
  var token = req.headers['x-access-token']
  //var token = req.params.token;
  if (token) {
    jwt.verify(token, config.secret, (err, decoded)=> {
      if (err) {
        res.status(403).send({ success: false, message: "Failed to authenticate user." })
      } else {
        req.decoded = decoded
        next()
      }
    })
  } else {
    res.status(403).send({ success: false, message: "No Token Provided." })
  }
})*/

// simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to gymmaster application." });
});

/*Upload Functionality*/
/** API path that will upload the files */
app.post('/upload', function(req, res) {
	upload(req,res,function(err){
		//console.log(req.file);
		if(err){
			 res.json({error_code:1,err_desc:err});
			 return;
		}
		 res.json({error_code:0,err_desc:null});
	});
});

var storage = multer.diskStorage({ //multers disk storage settings
	destination: function (req, file, cb) {
		cb(null, DIR);
	},
	filename: function (req, file, cb) {
		var datetimestamp = Date.now();
		//cb(null, file.fieldname + '-' + datetimestamp + '.' + file.originalname.split('.')[file.originalname.split('.').length -1]);
		cb(null,file.originalname);
	}
});

var upload = multer({ //multer settings
    storage: storage
}).single('file');


require("./app/routes/gymmaster.routes.js")(app);

// set port, listen for requests
app.listen(3000, () => {
  console.log("Server is running on port 3000.");
});