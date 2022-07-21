var jwt = require("jsonwebtoken");
module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decode = jwt.verify(token, process.env.SECRETKEY);
    req.userdata = decode;
    //   res.send(decode);
    next();
  } catch (error) {
    res.send({ message: "Auth failed" });
  }
};
