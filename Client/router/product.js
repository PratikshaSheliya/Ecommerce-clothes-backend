const express = require("express");
const productrouter = express.Router();
const cors = require("cors");
productrouter.use(cors());
const path = require("path");
const auth = require("../../Middleware/auth");
const multer = require("multer");
const fs = require("fs");
const { AddProduct ,showProduct,DeleteProduct,GetOneProduct,DeleteImages,UpdateProduct} = require("../controller/product");

const bannerStorage = multer.diskStorage({
  destination: async function (req, file, cb) {
    const banneruploadDir = path.join(
      __dirname,
      "..",
      "..",
      "public",
      "product_images"
    );
    
    if (fs.existsSync(banneruploadDir)) {
      cb(null, banneruploadDir);
    } else {
      fs.mkdirSync(banneruploadDir, { recursive: true });
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
});


productrouter.post("/addproduct", uploadBannerImg.fields([{name: 'images'}]), AddProduct);
productrouter.get("/showproduct", showProduct);
productrouter.delete("/deleteproduct", DeleteProduct);
productrouter.get("/product/:id", GetOneProduct);
productrouter.delete("/deleteimage", DeleteImages);
productrouter.put("/updateproduct",uploadBannerImg.fields([{name: 'images'}]), UpdateProduct);

module.exports = productrouter;
