require('dotenv').config(); // ✅ at the top

const express = require("express");
const Razorpay = require("razorpay");
const nodemailer = require("nodemailer");
const router = express.Router();
const Booking = require("../models/Booking");
const User = require("../models/User");

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// 📩 Setup Email Transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,       // your Gmail
    pass: process.env.EMAIL_PASS,       // Gmail app password
  },
});




// 📌 1. BOOKING ROUTE
router.post("/book", async (req, res) => {
  const { userName, userEmail, providerName, providerPhone, service, pincode } = req.body;

  try {
    // Check previous bookings by this user
    const previousBookings = await Booking.find({ userEmail });

    const newBooking = new Booking({
      userName,
      userEmail,
      providerName,
      providerPhone,
      service,
      pincode,
    });

    await newBooking.save();

    // First booking = free
    const freeBooking = previousBookings.length === 0;

    if (freeBooking) {
      // Send email immediately
      await sendEmail(userEmail, providerName, providerPhone, service, pincode, "FREE");

      return res.json({ success: true, freeBooking: true, bookingId: newBooking._id });
    }

    // Otherwise return bookingId for later payment
    res.json({ success: true, freeBooking: false, bookingId: newBooking._id });
  } catch (error) {
    console.error("Booking error:", error);
    res.status(500).json({ error: "Booking failed." });
  }
});

// 📌 2. CREATE RAZORPAY ORDER

router.post("/create-payment", async (req, res) => {
  const { amount, name, email } = req.body;

  if (!amount || !name || !email) {
    return res.status(400).json({ error: "Missing fields" });
  }

  try {
    const options = {
      amount: parseInt(amount), // amount must be in paise (e.g., ₹9 = 900)
      currency: "INR",
      receipt: `rcpt_${Math.floor(Math.random() * 1000000)}`,
      payment_capture: 1, // Auto-capture payment
    };

    const order = await razorpay.orders.create(options);

    res.status(200).json({
      order,
      razorpayKey: process.env.RAZORPAY_KEY_ID,
    });
  } catch (err) {
    console.error("Razorpay order error:", err);
    res.status(500).json({ error: "Unable to create order" });
  }
});

// 📌 3. CONFIRM PAYMENT & EMAIL
router.post("/confirm-payment", async (req, res) => {
  const { bookingId, paymentId } = req.body;

  try {
    const booking = await Booking.findById(bookingId);
    if (!booking) return res.status(404).json({ error: "Booking not found" });

    booking.paymentId = paymentId;
    await booking.save();

    await sendEmail(
      booking.userEmail,
      booking.providerName,
      booking.providerPhone,
      booking.service,
      booking.pincode,
      paymentId
    );

    res.json({ success: true });
  } catch (err) {
    console.error("Confirm payment error:", err);
    res.status(500).json({ error: "Failed to confirm payment" });
  }
});

router.get("/bookings/:email", async (req, res) => {
  try {
    const email = req.params.email;

    const bookings = await Booking.find({ userEmail: email }).sort({ createdAt: -1 });

    if (!bookings.length) {
      return res.status(404).json({ message: "No bookings found for this email" });
    }

    res.json(bookings);
  } catch (err) {
    console.error("Error fetching bookings:", err);
    res.status(500).json({ error: "Failed to fetch bookings" });
  }
});

// 📧 Helper: Send Email
async function sendEmail(to, providerName, phone, service, pincode, payment) {
  const adminEmail = process.env.EMAIL_USER; // Admin email from .env

  const recipients = [to, adminEmail]; // Send to both user and admin

  const mailOptions = {
    from: `"FixNearu" <${adminEmail}>`,
    to: recipients,
    subject: "Booking Confirmed - FixNearu",
    html: `
      <h2>📌 Booking Confirmed!</h2>
      <p><strong>Provider:</strong> ${providerName}</p>
      <p><strong>Phone:</strong> ${phone}</p>
      <p><strong>Service:</strong> ${service}</p>
      <p><strong>Pincode:</strong> ${pincode}</p>
      <p><strong>Payment:</strong> ${payment === "FREE" ? "First booking - Free" : `Paid ₹9 (ID: ${payment})`}</p>
      <br/>
      <p>Thank you for using FixNearu.</p>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("✅ Email sent to:", recipients.join(", "));
  } catch (err) {
    console.error("❌ Failed to send email:", err);
  }
}

module.exports = router;


