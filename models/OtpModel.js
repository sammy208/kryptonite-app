const mongoose = require('mongoose');


const OtpSchema = new mongoose.Schema({

  created_at: {
    type: Date,
    default: Date.now,
    expires: 300
  },
  email: { required: true, type: String, immutable: true },
  code: { required: true, type: String, immutable: true }
});

module.exports = mongoose.model('Otp',OtpSchema);