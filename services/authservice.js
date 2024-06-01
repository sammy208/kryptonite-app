const bcrypt = require('bcrypt'); 
const jwt = require('jsonwebtoken'); 
const uuid = require('uuid'); 
const redisClient = require('../utils/redis'); 
const emailUtil = require('../utils/email'); 
const Kryptonian = require('../models/Kryptonian'); 
const config = require('../config'); 

const register = async (email, password) => {
    const hashedPassword = await bcrypt.hash(password, 10); 
    const apiKey = uuid.v4(); 
    const kryptonian = new Kryptonian({ email, password: hashedPassword, apiKey }); 
    await kryptonian.save(); 

    const token = jwt.sign({ id: kryptonian._id }, config.jwtSecret, { expiresIn: '1h' }); 
    return { token, apiKey }; 
};

const generateOTP = async (email) => {
    const kryptonian = await Kryptonian.findOne({ email }); 
    if (!kryptonian) throw new Error('Kryptonian not found'); 

    const otp = Math.floor(100000 + Math.random() * 900000).toString(); 
    await redisClient.setex(email, config.otpExpiry, otp); 
    await emailUtil.sendEmail(email, 'Your OTP Code', `Your OTP is ${otp}`); 
};

const verifyOTP = async (email, otp) => {
    const storedOtp = await redisClient.get(email); 
    if (storedOtp !== otp) throw new Error('Invalid or expired OTP'); 

    const kryptonian = await Kryptonian.findOne({ email }); 
    const token = jwt.sign({ id: kryptonian._id }, config.jwtSecret, { expiresIn: '1h' }); 
    return token; 
};

const invalidateApiKey = async (apiKey) => {
    const kryptonian = await Kryptonian.findOne({ apiKey }); 
    if (!kryptonian) throw new Error('Invalid API key'); 

    kryptonian.apiKey = null; 
    await kryptonian.save(); 
    return true; 
};

module.exports = {
    register,
    generateOTP,
    verifyOTP,
    invalidateApiKey
};