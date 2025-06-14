const request = require('supertest');
const app = require('../app');
const { sequelize } = require('../models'); // Adjust the path as necessary
// const { Account } = require('../models');
const testToken ="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImVtYWlsIjoic2VsdmFzc3ViZW4xM0BnbWFpbC5jb20iLCJyb2xlIjoiQWRtaW4iLCJpYXQiOjE3NDk4OTA2OTksImV4cCI6MTc0OTk3NzA5OX0.VgbAy4OTbmHgKeiwCFqdL2LVlascLoR9bs7-neklD3Y"


describe('Logs API - Get All Logs ()', () => {

    test('Logs retreived successfully', async () => {
        const res = await request(app)
            .get('/api/logs') // Adjust route if needed
            .set('Authorization', `Bearer ${testToken}`);

        expect(res.statusCode).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.message).toBe('Logs retrieved successfully');
        // expect(Array.isArray(res.body.data)).toBe(true);
        // expect(res.body.data.length).toBeGreaterThanOrEqual(2);
        expect(res.body.data[0]).toHaveProperty('event_id');
                expect(res.body.data[0])?.toHaveProperty('AccountId');
        expect(res.body.data[0])?.toHaveProperty('DestinationId');
    });

});

describe('Logs Search API', () => {
    it('should return 400 if At least one search parameter is required.', async () => {
        const res = await request(app)
            .post('/api/logs/search')
            .set('Authorization', `Bearer ${testToken}`) // Add this
            .send({});
        expect(res.statusCode).toEqual(400);
        expect(res.body.message).toEqual('At least one search parameter is required.');
    });

    it('should return 200 and data if status exists', async () => {
        const res = await request(app)
            .post('/api/logs/search')
            .set('Authorization', `Bearer ${testToken}`) // Add this
            .send({ status: 'success' });

        expect(res.statusCode).toEqual(200);
        expect(res.body.success).toBe(true);
   expect(res.body.data[0]).toHaveProperty('event_id');
        expect(res.body.data[0]).toHaveProperty('status');    });

    it('should return 404 if Logs  not found', async () => {
        const res = await request(app)
            .post('/api/logs/search')
            .set('Authorization', `Bearer ${testToken}`) // Add this
            .send({ status: 'NonExistingAccount' });

        expect(res.statusCode).toEqual(404);
        expect(res.body.message).toEqual('Logs not found');
    });
});
