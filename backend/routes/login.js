const express = require('express');
const bcrypt = require('bcrypt'); // ✅ Required for comparing hashed passwords
const router = express.Router();
const User = require('../models/User'); // ✅


// User Login Route
router.post('/api/login/user', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // ✅ Secure compare using bcrypt
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // ✅ Success
    res.status(200).json({
      email: user.email,
      fullName: user.fullName
    });

  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;

