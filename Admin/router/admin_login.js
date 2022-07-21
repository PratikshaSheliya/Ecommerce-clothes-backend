const express = require("express");
const adminrouter = express.Router();
const cors = require("cors");
adminrouter.use(cors());
const path = require("path");
const bcrypt = require("bcrypt");
const auth = require("../../Middleware/auth");
const { adminLogin, loggedin ,allUsers,userStatus} = require("../controller/admin_login");

// adminrouter.post("/adminlogin", adminLogin);
// adminrouter.get("/loggedin", auth, loggedin);
adminrouter.get("/allusers", allUsers);
adminrouter.put("/userstatus", userStatus);

module.exports = adminrouter;
