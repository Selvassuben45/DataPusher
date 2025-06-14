// workers/dataProcessor.js
const axios = require('axios');
const dataQueue = require('../config/queue');
const { Log } = require('../models');

dataQueue.process(async (job, done) => {
    const { account_id, event_id, destination, received_data } = job.data;

    try {
        const processedTimestamp = new Date();

        const response = await axios({
            method: destination.http_method,
            url: destination.url,
            headers: JSON.parse(destination.headers),
            data: received_data
        });
console.log(response);

        await Log.create({
            event_id,
            account_id,
            destination_id: destination.id,
            received_timestamp: new Date(),
            processed_timestamp: processedTimestamp,
            received_data: JSON.stringify(received_data),
            status: 'success'
        });

        done();
    } catch (error) {
          console.error('Job processing failed:', error.message);
    console.error('Error details:', error);
        await Log.create({
            event_id,
            account_id,
            destination_id: destination.id,
            received_timestamp: new Date(),
            processed_timestamp: new Date(),
            received_data: JSON.stringify(received_data),
            status: 'failed'
        });

        done(new Error('Webhook sending failed'));
    }
});
