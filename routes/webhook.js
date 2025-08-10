// routes/webhook.js
const express = require('express');
const crypto = require('crypto');
const router = express.Router();

const WEBHOOK_SECRET = process.env.RAZORPAY_WEBHOOK_SECRET;

router.post('/razorpay/webhook', express.raw({ type: 'application/json' }), (req, res) => {
  const receivedSignature = req.headers['x-razorpay-signature'];
  const body = req.body;

  const expectedSignature = crypto
    .createHmac('sha256', WEBHOOK_SECRET)
    .update(req.body)
    .digest('hex');

  if (receivedSignature === expectedSignature) {
    const payload = JSON.parse(req.body.toString());

    // ✅ You can log or process payment info
    if (payload.event === 'payment.captured') {
      console.log('✅ Payment captured via Webhook:', payload.payload.payment.entity);
      // Save to DB, send email, etc.
    }

    if (payload.event === 'payment.failed') {
      console.log('❌ Payment failed via Webhook:', payload.payload.payment.entity);
    }

    res.status(200).json({ status: 'ok' });
  } else {
    console.warn("❌ Invalid webhook signature.");
    res.status(400).json({ error: "Invalid signature" });
  }
});

module.exports = router;
