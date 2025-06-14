const request = require('supertest');
const app = require('../app');
const { sequelize } = require('../models');
const { Account } = require('../models');
const testToken ="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImVtYWlsIjoic2VsdmFzc3ViZW4xM0BnbWFpbC5jb20iLCJyb2xlIjoiQWRtaW4iLCJpYXQiOjE3NDk4OTA2OTksImV4cCI6MTc0OTk3NzA5OX0.VgbAy4OTbmHgKeiwCFqdL2LVlascLoR9bs7-neklD3Y"


describe('Destination API - Get All Destinations ()', () => {

    test('Accounts retreived successfully', async () => {
        const res = await request(app)
            .get('/api/destinations')
            .set('Authorization', `Bearer ${testToken}`);

        expect(res.statusCode).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.message).toBe('Destinations retrieved successfully');

        expect(res.body.data[0]).toHaveProperty('url');
        expect(res.body.data[0]).toHaveProperty('http_method');
    });
});


describe('Destination Search API', () => {
    it('should return 400 if At least one search parameter is required', async () => {
        const res = await request(app)
            .post('/api/destinations/search')
            .set('Authorization', `Bearer ${testToken}`)
            .send({});
        expect(res.statusCode).toEqual(400);
        expect(res.body.message).toEqual('At least one search parameter is required');
    });

    it('should return 200 and data if Destination exists', async () => {
        const res = await request(app)
            .post('/api/destinations/search')
            .set('Authorization', `Bearer ${testToken}`)
            .send({ url: 'https://webhook.site/12345abcde' });

        expect(res.statusCode).toEqual(200);
        expect(res.body.success).toBe(true);
        expect(res.body.data.length).toBeGreaterThan(0);
    });

    it('should return 404 if Destination  not found', async () => {
        const res = await request(app)
            .post('/api/destinations/search')
            .set('Authorization', `Bearer ${testToken}`)
            .send({ url: 'Non existingURL' });

        expect(res.statusCode).toEqual(404);
        expect(res.body.message).toEqual('Destination not found');
    });
});
