const mongoose = require("mongoose");

const cartSchema = mongoose.Schema({
  user_id: {
    type: String,
    require: true,
  },
  cart_details: [{
    product_id: {
      type: String,
      require: true,
    },
    quantity: {
      type:Number,
      require : true
    }
  }]
});

const cart = mongoose.model("cart",cartSchema)

module.exports = cart;