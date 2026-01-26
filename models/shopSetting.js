const mongoose = require("mongoose");

const shopSettingSchema = new mongoose.Schema({
  isOpen: {
    type: Boolean,
    default: true
  },
  closedMessage: {
    type: String,
    default: "Shop is currently closed. Please visit later."
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("ShopSetting", shopSettingSchema);
