const mongoose = require('mongoose');

const providerSchema = new mongoose.Schema({
  fullName: String,
  phone : String,
  password: String,
  service : String ,
  pincode: String,
  latitude: Number,
  longitude: Number
});

module.exports = mongoose.model('ServiceProvider', providerSchema);
