const jwt = require("jsonwebtoken");
const config = require("./config");
const User = require("./models/user");

let checkToken = (req, res, next) => {
    let token = req.headers["authorization"];
    token = token.slice(7, token.length);
    if (token) {
      jwt.verify(token, config.key, (err, decoded) => {
        if (err) {
          return res.json({
            status: false,
            msg: "token is invalid",
          });
        } else {
          req.decoded = decoded;
          console.log(decoded);
          const {id} = decoded;
          req.user;
          User.findById(id).then(userdata=>{
            req.user = userdata
            next()
          })
          console.log(req.user);
          // next();
        }
      });
    } else {
      return res.json({
        status: false,
        msg: "Token is not provided",
      });
    }
  };
  

module.exports =  {
    checkToken: checkToken,
}