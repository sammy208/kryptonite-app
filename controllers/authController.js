const authService = require('../services/authservice'); // Import authentication service

// Controller for registering a Kryptonian
const register = async (req, res) => {
    try {
        const { email, password } = req.body; // Extract email and password from request body
        const { token, apiKey } = await authService.register(email, password); // Register the Kryptonian
        res.status(201).json({ token, apiKey }); // Respond with JWT token and API key
    } catch (error) {
        res.status(400).json({ error: error.message }); // Respond with error message
    }
};

// Controller for generating OTP
const generateOTP = async (req, res) => {
    try {
        const { email } = req.body; // Extract email from request body
        await authService.generateOTP(email); // Generate OTP for the email
        res.status(200).json({ message: 'OTP sent to email' }); // Respond with success message
    } catch (error) {
        res.status(400).json({ error: error.message }); // Respond with error message
    }
};

// Controller for verifying OTP
const verifyOTP = async (req, res) => {
    try {
        const { email, otp } = req.body; // Extract email and OTP from request body
        const token = await authService.verifyOTP(email, otp); // Verify OTP
        res.status(200).json({ token }); // Respond with JWT token
    } catch (error) {
        res.status(400).json({ error: error.message }); // Respond with error message
    }
};

// Controller for invalidating API key
const invalidateApiKey = async (req, res) => {
    try {
        const { apiKey } = req.body; // Extract API key from request body
        await authService.invalidateApiKey(apiKey); // Invalidate the API key
        res.status(200).json({ message: 'API key invalidated' }); // Respond with success message
    } catch (error) {
        res.status(400).json({ error: error.message }); // Respond with error message
    }
};

module.exports = {
    register,
    generateOTP,
    verifyOTP,
    invalidateApiKey
};