const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const User = require('../models/User');
const ServiceProvider = require('../models/serviceprovider');

// Test routes
router.get('/test', (req, res) => res.send('API is working!'));
router.get('/test-route', (req, res) => res.send("✅ Route working!"));

// User Signup
router.post('/signup/user', async (req, res) => {
  const { fullName, email, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ fullName, email, password: hashedPassword });
    await user.save();
    res.status(201).json({ message: "User registered successfully!" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Provider Signup
router.post('/signup/provider', async (req, res) => {
  const { fullName, phone, password, service, pincode, latitude, longitude } = req.body;
  try {
    if (!password) return res.status(400).json({ error: "Password is required" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const provider = new ServiceProvider({
      fullName, phone, password: hashedPassword, service, pincode, latitude, longitude
    });
    await provider.save();
    res.status(201).json({ message: "Provider registered successfully!" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Provider Login
router.post('/login/provider', async (req, res) => {
  const { phone, password } = req.body;
  try {
    const provider = await ServiceProvider.findOne({ phone });
    if (!provider) return res.status(401).json({ error: "Invalid phone or password" });

    const isMatch = await bcrypt.compare(password, provider.password);
    if (!isMatch) return res.status(401).json({ error: "Invalid phone or password" });

    res.json({ message: "Login successful!" });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// Search Providers
router.get('/search', async (req, res) => {
  const { service, pincode } = req.query;
  try {
    const results = await ServiceProvider.find({
      service: { $regex: new RegExp(`^${service}$`, 'i') },
      pincode
    });
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

