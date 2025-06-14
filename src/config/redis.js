// redisClient.js
const Redis = require('ioredis');
const redis = new Redis(); // Connects to localhost:6379 by default
module.exports = redis;
