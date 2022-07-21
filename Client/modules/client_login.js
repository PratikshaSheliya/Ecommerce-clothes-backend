const mongoose = require("mongoose");
const userSchema = mongoose.Schema(
  {
    firstname: {
      type: String,
      require: true,
    },
    lastname: {
      type: String,
      require: true,
    },
    email: {
      type: String,
      require: true,
    },
    password: {
      type: String,
      require: true,
    },
    phonenumber: {
      type: String,
      require: true,
    },
    address: {
      type: String,
      require: true,
    },
    city: {
      type: String,
      require: true,
    },
    status: {
      type: String,
      require: true,
    },
    role: {
      type: String,
      require: true,
    },
    image: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const userProfile = mongoose.model("userprofile", userSchema);

module.exports = userProfile;
