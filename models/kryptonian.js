const mongoose = require('mongoose'); // Import Mongoose

// Define the Kryptonian schema
const kryptonianSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true }, // Email field
    password: { type: String, required: true }, // Password field
    apiKey: { type: String, required: true }, // API key field
    images: [{ type: String }] // Images field (array of base64 strings)
});

module.exports = mongoose.model('Kryptonian', kryptonianSchema); // Export the Kryptonian model