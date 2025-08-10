const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');

router.post('/contact', async (req, res) => {
  const { name, email, message } = req.body;
  if (!name || !email || !message) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'servicenearme07@gmail.com',         // ✅ Replace
        pass: 'vyhr zqly avlm pmds'            // ✅ Gmail App Password only
      }
    });

    const mailOptions = {
      from: email,
      to: 'servicenearme07@gmail.com',        // ✅ Admin receives this
      subject: `Contact Request from ${name}`,
      text: `From: ${name}\nEmail: ${email}\nMessage:\n${message}`
    };

    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: "Message sent to admin successfully!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to send message" });
  }
});

module.exports = router;
