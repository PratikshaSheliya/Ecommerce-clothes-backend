const UserData = require("../../Client/modules/client_login");
const bcrypt = require("bcrypt");
var jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

// exports.adminLogin = async (req, res) => {
//   try {
//     const { email, password } = req.body;
//     const data = await AdminLogin.findOne({ email: email }).lean().exec();
//     if (!data) {
//       res.status(400).send({
//         email,
//         message: "User Not Found",
//       });
//     } else {
//       bcrypt.compare(req.body.password, data.password, (err, result) => {
//         if (err) {
//           return res.status(400).send({
//             success: false,
//             message: err,
//           });
//         } else {
//           if (!result) {
//             return res.status(400).send({
//               success: false,
//               message: "The entered password was wrong.",
//             });
//           }
//           const payload = {
//             adminId: data._id,
//             email: data.email,
//           };
//           data.token = jwt.sign(payload, process.env.SECRETKEY);
//           res.status(200).send({
//             success: true,
//             token: data.token,
//             message: "Login Successfully.",
//           });
//         }
//       });
//     }
//   } catch (error) {
//     console.log("error", error);
//   }
// };

exports.allUsers = async (req, res) => {
  try {
    const data = await UserData.find({ role: "user" }).lean().exec();
    res.status(200).send({ success: true, data: data });
  } catch (error) {
    res.status(400).send({ error: error });
  }
};

//block & unblock
exports.userStatus = (req, res) => {
  const { id, status } = req.body;
  const newStatus = {
    id,
    status,
  };
  console.log("nwe", req.body);
  console.log("newStatus", newStatus);
  const result = UserData.findByIdAndUpdate(
    id,
    newStatus,
    (err, updatedBoard) => {
      if (err) {
        res.json({
          newStatus,
          success: false,
          msg: "Failed to update status",
        });
      } else {
        res.json({
          newStatus,
          success: true,
          msg: "status change successfully",
        });
      }
    }
  );
};

// exports.loggedin = async (req, res) => {
//   try {
//     const userid = req.userdata.adminId;
//     const data = await AdminLogin.findById(userid);
//     res.send({ data: data });
//   } catch (error) {
//     res.send({ error: "error" });
//   }
// };
