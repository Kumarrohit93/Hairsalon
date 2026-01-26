const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    name: {type: String, required: true},
    phoneNumber: { type: Number },
    password: { type: String, required: true },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Admin", adminSchema);
