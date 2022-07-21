const userProfile = require("../modules/client_login");
const bcrypt = require("bcrypt");
var jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const nodemailer = require("nodemailer");
dotenv.config();

exports.userSignup = async (req, res) => {
  try {
    const { firstname, lastname, email, password, status, role } = req.body;
    const signupData = bcrypt.hash(req.body.password, 10, async (err, hash) => {
      if (err) {
        throw err;
      } else {
        const data = await userProfile.findOne({ email }).lean().exec();
        if (data) {
          res
            .status(400)
            .send({ success: false, msg: "Email address is Already exists" });
        } else {
          const profileData = new userProfile({
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            email: req.body.email,
            status: "unblock",
            role: "user",
            password: hash,
          });
          const result = await profileData.save();
          res
            .status(200)
            .send({ success: true, msg: "Signup successfully", data: result });
        }
      }
    });
  } catch (error) {}
};

exports.userLogin = async (req, res) => {
  try {
    const { email, password, role } = req.body;
    const userExist = await userProfile.findOne({ email }).lean().exec();
    const userStatus = await userProfile
      .findOne({ email: email, status: "block" })
      .lean()
      .exec();
    const userRoleMatch = await userProfile
      .findOne({ email: email, role: role })
      .lean()
      .exec();
    if (!userExist)
      return res.status(400).send({ success: false, msg: "User not Found" });
    if (userStatus)
      return res.status(400).send({
        success: false,
        msg: "Your account is deactivated. Please contact admin for further inquiry ! ",
      });
    if (!userRoleMatch)
      return res
        .status(400)
        .send({ success: false, msg: "Unauthorized Login" });
    if (userRoleMatch) {
      bcrypt.compare(req.body.password, userExist.password, (err, result) => {
        if (err) {
          return res.status(400).send({
            success: false,
            msg: err,
          });
        } else {
          if (!result) {
            return res.status(400).send({
              success: false,
              msg: "The entered password was wrong.",
            });
          } else {
            const payload = {
              userId: userExist._id,
            };
            userExist.token = jwt.sign(payload, process.env.USERSECRETKEY);
            res.status(200).send({
              success: true,
              token: userExist.token,
              msg: "Login Successfully.",
            });
          }
        }
      });
    }
  } catch (error) {
    console.log(error);
    res.status(400).send({ error: error });
  }
};

//forgotpwd
exports.forgotpwd = async (req, res) => {
  const { _id, password } = req.body;
  const hashPwd = bcrypt.hash(req.body.password, 10, async (err, hash) => {
    const changePwd = {
      _id,
      password: hash,
    };
    const result = userProfile.findByIdAndUpdate(
      _id,
      changePwd,
      (err, updatedPwd) => {
        if (err) {
          res.json({
            changePwd,
            success: false,
            msg: "Failed to update password",
          });
        } else {
          res.json({
            changePwd,
            success: true,
            msg: "Password change successfully",
          });
        }
      }
    );
  });
};

//send mail
exports.sendMail = async (req, res) => {
  // try {
  const { email } = req.body;
  let findEmail = await userProfile.findOne({ email }).lean().exec();
  console.log("findEmail==>", findEmail);
  if (!findEmail) {
    res.status(400).send({ success: false, msg: "Please Enter Valid Email" });
  } else {
    to = req.body.email;
    // console.log("to", to);
    // console.log("findEmail[0].id", findEmail._id);
    url = `http://localhost:4200/forgotpassword?id=${findEmail._id}`;
    adminurl = `http://localhost:4201/auth/modern/reset-password?id=${findEmail._id}`;
    console.log("url", url);
    var transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "sheliyapratiksha.dds@gmail.com",
        pass: "nzmsvmaapxbgcxtd",
      },
    });

    if (findEmail.role == "user") {
      var mailoptions = {
        from: "Lavish Alice Customer Support<sheliyapratiksha.dds@gmail.com>",
        to: to,
        html: `
         <h2>Forgot your Password?</h2>
         <h3>We received a request to reset the password for your account</h3>
         <h3>To reset your password , click on the link below</h3>
          <a href = "${url}">Click Here</a>
          `,
      };
    } else if (findEmail.role == "admin") {
      var mailoptions = {
        from: "Lavish Alice Customer Support<sheliyapratiksha.dds@gmail.com>",
        to: to,
        html: `
         <h2>Forgot your Password?</h2>
         <h3>We received a request to reset the password for your account</h3>
         <h3>To reset your password , click on the link below</h3>
          <a href = "${adminurl}">Click Here</a>
          `,
      };
    } else {
    }

    transporter.sendMail(mailoptions, (err, info) => {
      if (err) {
        console.log("sendmailerror", err);
      } else {
        console.log("Email Sent" + info.response);
        alert("Email Sent");
      }
    });
    res.status(200).send({ meassage: "Email sent successfully.." });
  }
};

//change password
exports.changepassword = async (req, res) => {
  const { _id, oldpassword, newpassword } = req.body;
  const GetData = await userProfile.findOne({ _id }).lean().exec();
  const comparePassword = await bcrypt.compare(oldpassword, GetData.password);
  if (!comparePassword) {
    return res.status(400).send({success : false , msg:"Please Enter the old password"})
  }
  const hash = await bcrypt.hash(newpassword, 10);
  // console.log("hash",hash);
  const ChangePassword = await userProfile.findByIdAndUpdate(
    { _id: req.body._id },
    { $set: { password: hash } }
  );
  return res.status(200).send({success : true , msg:"Password change successfully."})
};

//edit profile
exports.editProfile = (req, res) => {
  try {
    const { _id, firstname, lastname, email, address, city, phonenumber } =
      req.body;
    if (req.file) {
      const image = req.file.filepath + req.file.filename;
      const updateProfile = {
        firstname,
        lastname,
        email,
        address,
        city,
        phonenumber,
        image,
      };

      const result = userProfile.findByIdAndUpdate(
        _id,
        updateProfile,
        (err, updateProfileData) => {
          if (err) {
            throw err;
          } else {
            res.status(200).send({
              success: true,
              data: updateProfileData,
              msg: "Update Successfully",
            });
            // console.log("updateProfileData", updateProfileData);
          }
        }
      );
    } else {
      const updateProfile = {
        firstname,
        lastname,
        email,
        address,
        city,
        phonenumber,
      };

      const result = userProfile.findByIdAndUpdate(
        _id,
        updateProfile,
        (err, updateProfileData) => {
          if (err) {
            throw err;
          } else {
            res.status(200).send({
              success: true,
              data: updateProfileData,
              msg: "Update Successfully",
            });
            // console.log("updateProfileData", updateProfileData);
          }
        }
      );
    }
  } catch (error) {
    console.log("error===>>", error);
    res.status(400).send({ success: false, msg: "Update falied" });
  }
};

//loggedin
exports.userLoggedin = async (req, res) => {
  try {
    const userid = req.userdata.userId;
    const data = await userProfile.findById(userid);
    res.send({ data: data });
  } catch (error) {
    res.send({ error: "error" });
  }
};
