const mongoose = require("mongoose");

mongoose
  .connect("mongodb://localhost:27017/EcommerceClothesApp")
  .then(() => console.log("Connection Successfully"))
  .catch((err) => console.log("Connection failed",err));
