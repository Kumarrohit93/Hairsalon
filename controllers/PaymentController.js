const razorpay = require("../utils/razorpay");
const Customer = require("../models/customer");
const crypto = require("crypto");

const createOrder = async (req, res) => {
    console.log("key: ", process.env.RAZORPAY_KEY_ID)
    console.log("sercret: ", process.env.RAZORPAY_KEY_SECRET)
  const { customerId } = req.body;

  const customer = await Customer.findById(customerId);
  if (!customer) return res.status(404).json({ msg: "Customer not found" });

  const order = await razorpay.orders.create({
    amount: customer.totalAmount * 100,
    currency: "INR",
    receipt: "rcpt_" + customer._id,
  });

  customer.razorpayOrderId = order.id;
  await customer.save();

  res.json(order);
};


const verifyPayment = async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, customerId } = req.body;

  const body = razorpay_order_id + "|" + razorpay_payment_id;

  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(body)
    .digest("hex");

  if (expectedSignature !== razorpay_signature) {
    return res.status(400).send("Invalid signature");
  }

  const customer = await Customer.findById(customerId);

  customer.paymentStatus = "paid";
  customer.paymentMethod = "razorpay";
  customer.razorpayPaymentId = razorpay_payment_id;
  customer.razorpaySignature = razorpay_signature;

  await customer.save();

  res.redirect(`/status/${customer.publicToken}`);
};

module.exports = { createOrder, verifyPayment };
