const Authenticate = require("../models/authenticate.model.js");

//Log In
exports.login = (req, res) => {
    Authenticate.login(req.body.USER_ID,req.body.PASSWORD,(err, data) => {
        if (err) {
            if (err.kind === "Login Failed") {
                res.status(404).send({
                    message: `Incorrect User ID or Password.`
                });
            } else {
                res.status(500).send({
                    message: `Incorrect User ID or Password.`
                });
            }
        } else res.send(data);
  });
};



