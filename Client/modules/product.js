const mongoose = require("mongoose");
const ProductSchema = mongoose.Schema(
  {
    name: {
      type: String,
      require: true,
    },
    price: {
      type: Number,
      require: true,
    },
    size: {
      type: String,
      require: true,
    },
    description: {
      type: String,
      require: true,
    },
    material: {
      type: String,
      require: true,
    },
    care: {
      type: String,
      require: true,
    },
    modelHeight: {
      type: String,
      require: true,
    },
    modelSize: {
      type: String,
      require: true,
    },
    quantity: {
      type: Number,
      require: true,
    },
    category: {
      type: String,
      require: true,
    },
    color: {
      type: String,
      require: true,
    },
    date: {
      type: String,
      require: true,
    },
    discount: {
      type: String,
      require: true,
    },
    product_collection: {
      type: String,
      require: true,
    },
    images: [{
      name: {
        type: String,
        require: true,
      }
    }],
    code: {
      type: String,
      require: true,
      uppercase: true
    },
  },
  {
    timestamps: true,
  }
);

const product = mongoose.model("product", ProductSchema);

module.exports = product;
