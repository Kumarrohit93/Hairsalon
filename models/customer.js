const mongoose = require("mongoose");

const bookedServiceSchema = new mongoose.Schema(
  {
    serviceId: { type: mongoose.Schema.Types.ObjectId, ref: "Service" },
    name: String,
    duration: Number,
    price: Number,
  },
  { _id: false },
);

const customerSchema = new mongoose.Schema(
  {
    name: String,
    phone: String,

    services: {
      type: [bookedServiceSchema],
      default: [],
    },

    totalEstimatedTime: { type: Number, default: 0 },
    totalAmount: { type: Number, default: 0 },

    type: { type: String, enum: ["walkin", "booking"], required: true },
    publicToken: {
      type: String,
      unique: true,
      index: true,
    },
    tokenNumber: Number,

    status: {
      type: String,
      enum: ["waiting", "serving", "completed", "cancelled"],
      default: "waiting",
    },

    workerNumber: Number,

    estimatedStartTime: Date,
    estimatedEndTime: Date,

    delayMinutes: { type: Number, default: 0 },

    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed"],
      default: "pending",
    },

    paymentMethod: {
      type: String,
      enum: ["cash", "razorpay", "upi", "card", "online"],
    },

    razorpayOrderId: String,
    razorpayPaymentId: String,
    razorpaySignature: String,
  },
  { timestamps: true },
);

module.exports = mongoose.model("Customer", customerSchema);
