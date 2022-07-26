const mongoose = require("mongoose");

const wishListSchema = mongoose.Schema({
  user_id: {
    type: String,
    require: true,
  },
  product_id: [{
    type: String,
    require: true,
  }],
 
});

const wishlist = mongoose.model("wishlist",wishListSchema)

module.exports = wishlist;