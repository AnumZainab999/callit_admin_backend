const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema({
  orderId: { type: String, required: true, unique: true },
  userName: { type: String },
  userPhone: { type: String },

  ticketsPurchased: [
    {
      eventDay: Number,
      ticketType: String,
      quantity: Number,
      names: [String],
      price: Number
    }
  ],

  totalAmount: Number,

  paymentStatus: {
    type: String,
    enum: ["pending", "paid", "canceled", "failed"],
    default: "pending"
  },

  provider: { type: String, default: "PayFast" },
  transactionId: { type: String, default: null },

  dateCreated: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Order", OrderSchema);
