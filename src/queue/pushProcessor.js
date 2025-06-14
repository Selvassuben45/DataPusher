const axios = require('axios');
const { Destination, Log } = require('../models');
const { createLog } = require('../controller/logController');

const processJob = async (job) => {
    try {
        const { accountId, eventId, userId, action, details } = job.data;

        console.log('Processing job for account:', accountId, 'with event:', eventId);

        const destinations = await Destination.findAll({ where: { AccountId: accountId } });

        for (let destination of destinations) {
            let status = 'success';
            let processedAt = new Date();
            let errorMessage = '';

            try {
                // Prepare payload to push
                const payload = {
                    userId,
                    action,
                    details
                };

                await axios({
                    method: destination.http_method,
                    url: destination.url,
                    headers: destination.headers,
                    data: payload
                });

            } catch (error) {
                console.error(`Failed to push to destination ${destination.id}`, error.message);
                status = 'failed';
                errorMessage = error.message;
            }

            await createLog({
                event_id: eventId,
                AccountId: accountId,
                DestinationId: destination.id,
                received_timestamp: new Date(),
                processed_timestamp: processedAt,
                received_data: JSON.stringify({ userId, action, details }),
                status: status,
                error_message: errorMessage
            });
        }

        return Promise.resolve();

    } catch (error) {
        console.error('Queue Processor Error:', error.message);
        return Promise.reject(error);
    }
};


module.exports = { processJob };
