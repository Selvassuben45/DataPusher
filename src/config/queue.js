const Queue = require('bull');
const redisConfig = require('./redis'); // Redis connection

const queue = new Queue('push-data', {
    redis: redisConfig
});

const { processJob } = require('../queue/pushProcessor');

// Queue processor
queue.process(processJob);

module.exports = queue;
