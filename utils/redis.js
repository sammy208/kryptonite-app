const redis = require('redis'); 
const config = require('../config'); 

// Create Redis client
const redisClient = redis.createClient({
    host: config.redisHost, 

    port: config.redisPort,


    password :config.redisPassword 

});

redisClient.on('error', (err) => {
    console.log('Redis error: ', err); 
});

module.exports = redisClient; 