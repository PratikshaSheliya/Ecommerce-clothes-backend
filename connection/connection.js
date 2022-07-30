const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

mongoose
  .connect(process.env.SERVER_MONGO)
  .then(() => console.log("Connection Successfully"))
  .catch((err) => console.log("Connection failed",err));
