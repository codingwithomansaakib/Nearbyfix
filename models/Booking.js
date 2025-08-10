const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  userName: { type: String, required: true },
  userEmail: { type: String, required: true },
  service: { type: String, required: true },
  providerName: { type: String, required: true },
  providerPhone: { type: String, required: true },
  pincode: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  paymentId: { type: String, default: null },
});

module.exports = mongoose.model('Booking', bookingSchema);


