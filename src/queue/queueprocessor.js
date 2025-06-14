const queue = require('../config/queue');
const { processJob } = require('./pushProcessor');

queue.process('push-data', async (job, done) => {
    try {
        await processJob(job);
        console.log('Job Completed:', job.id);

        done();
    } catch (error) {
                console.error('Job Failed:', job.id, error.message);
        done(new Error('Job Processing Failed'));
    }
});