const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const uuid = require('uuid');
const redisClient = require('../utils/redis');
const emailUtil = require('../utils/email');
const Kryptonian = require('../models/Kryptonian');
const Otp = require('../models/OtpModel.js');
const config = require('../config');

const register = async (email, password) => {
  const hashedPassword = await bcrypt.hash(password, 10);
  const apiKey = uuid.v4();
  const kryptonian = new Kryptonian({ email, password: hashedPassword, apiKey });
  
  let _save = await kryptonian.save();
  if (!_save) {
    console.log('Server Error Occurred');
    return;
  }
  const token = jwt.sign({ id: kryptonian._id }, config.jwtSecret, { expiresIn: '1h' });
  return { token, apiKey };
};

const generateOTP = async (email) => {
  try {
    const kryptonian = await Kryptonian.findOne({ email });
    if (!kryptonian) {
      console.log('Kryptonian not found');
      return;
    }


    const code = Math.floor(100000 + Math.random() * 900000).toString();

    const otp = new Otp({ email: kryptonian.email, code });
    let checkmate = await otp.save();
    if (!checkmate) {
      console.log('Otp not saved');
      return;
    }
    let sent = await emailUtil.sendEmail(email, 'Your OTP Code', `Your OTP is ${otp}`);

    if (!sent) {
      console.log('Email not sent');
      return;
    }
  } catch (e) {
    console.log('server error occurred');
    return;
  }
};

const verifyOTP = async (email, otp) => {
  //const storedOtp = await redisClient.get(email);
  const checkOtp = await Otp.findOne({ email, code: otp });

  if (!checkOtp) {
    console.log('Otp not found or expired');
  }

  const kryptonian = await Kryptonian.findOne({ email: checkOtp.email });
  if (!kryptonian) {
    console.log('User not found');
    return;
  }
  const token = jwt.sign({ id: kryptonian._id }, config.jwtSecret, { expiresIn: '1h' });
  return token;
};

const invalidateApiKey = async (apiKey) => {
  try {
    const kryptonian = await Kryptonian.findOne({ apiKey });
    if (!kryptonian)
    {
      console.log('Invalid API key');
      return;
    }
    kryptonian.apiKey = null;

    const checkmate = await kryptonian.save();
    if (!checkmate) {
      console.log('User not found ');
      return;
    }
    return true;
  } catch (e) {
    console.log('server error occurred');
  }

};

module.exports = {
  register,
  generateOTP,
  verifyOTP,
  invalidateApiKey
};