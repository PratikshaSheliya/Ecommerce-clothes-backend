const express = require("express");
const userrouter = express.Router();
const cors = require("cors");
userrouter.use(cors());
const path = require("path");
const bcrypt = require("bcrypt");
const auth = require("../../Middleware/auth");
const multer = require('multer');
const fs = require('fs')
const { userSignup,userLogin ,userLoggedin,forgotpwd,sendMail,editProfile,changepassword} = require("../controller/client_login");

// const images = require('')


// var storage = multer.diskStorage({
//   destination: (req, file, callBack) => {
//     callBack(null,'./public/images'); // './public/images/' directory name where save the file
//   },
//   filename: (req, file, callBack) => {
//     callBack(
//       null,
//       file.fieldname + "-" + Date.now() + path.extname(file.originalname)
//     );
//   },
// });

// var upload = multer({
//   storage: storage,
// });

// ********** PROFILE IMAGES ************
const bannerStorage = multer.diskStorage({
  destination: async function (req, file, cb) {
      const banneruploadDir = path.join(__dirname, "..", "..", "public", "images");
      if (fs.existsSync(banneruploadDir)) {
          cb(null, banneruploadDir);
      } else {
          fs.mkdirSync(banneruploadDir, {recursive: true});
          cb(null, banneruploadDir);
      }
  },
  filename: async function (req, file, cb) {
      const image =
          Math.random().toString(36).substring(2, 15) +
          "_" +
          Date.now() +
          "." +
          file.originalname.split(".").reverse()[0];
      // console.log("object", image);
      cb(null, image);
  },
});
// ********** PROFILE IMAGES ************
const uploadBannerImg = multer({
  storage: bannerStorage,
  fileFilter: function (req, file, cb) {
      // console.log("file", file, req)
      const fileType = /jpeg|jpg|png|webp/;
      const extension = file.originalname.substring(
          file.originalname.lastIndexOf(".") + 1
      );
      file.filepath = '/images/'
      const mimetype = fileType.test(file.mimetype);
      if (mimetype && extension) {
          return cb(null, true);
      } else {
          cb("Error: only image format is supported (jpeg|jpg|png)");
      }
  },
});

userrouter.post("/signup", userSignup);
userrouter.post("/login", userLogin);
userrouter.put("/forgotpwd", forgotpwd);
userrouter.put("/changepassword", changepassword);
userrouter.post("/sendmail", sendMail);
userrouter.put("/editprofile",  uploadBannerImg.single('image') ,editProfile);
userrouter.get("/userloggedin",auth, userLoggedin);

module.exports = userrouter;
