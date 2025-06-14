const request = require('supertest');
const app = require('../app');
const { sequelize } = require('../models');
const { Account } = require('../models');
const testToken ="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImVtYWlsIjoic2VsdmFzc3ViZW4xM0BnbWFpbC5jb20iLCJyb2xlIjoiQWRtaW4iLCJpYXQiOjE3NDk4OTA2OTksImV4cCI6MTc0OTk3NzA5OX0.VgbAy4OTbmHgKeiwCFqdL2LVlascLoR9bs7-neklD3Y"


describe('Account API - Get All Accounts ()', () => {

    test('Accounts retreived successfully', async () => {
        const res = await request(app)
            .get('/api/accounts')
            .set('Authorization', `Bearer ${testToken}`);

        expect(res.statusCode).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.message).toBe('Accounts retrieved successfully');
        expect(res.body.data[0]).toHaveProperty('account_id');
        expect(res.body.data[0]).toHaveProperty('account_name');
    });
});

describe('Account Search API', () => {
    it('should return 400 if account_name is missing', async () => {
        const res = await request(app)
            .post('/api/accounts/search')
            .set('Authorization', `Bearer ${testToken}`)
            .send({});
        expect(res.statusCode).toEqual(400);
        expect(res.body.errors[0].msg)?.toEqual('Invalid Data: account_name is required');
    });

    it('should return 200 and data if account_name exists', async () => {
        const res = await request(app)
            .post('/api/accounts/search')
            .set('Authorization', `Bearer ${testToken}`)
            .send({ account_name: 'TechNW' });

        expect(res.statusCode).toEqual(200);
        expect(res.body.success).toBe(true);
        expect(res.body.data).toHaveProperty('rows');
    });

    it('should return 404 if account is not found', async () => {
        const res = await request(app)
            .post('/api/accounts/search')
            .set('Authorization', `Bearer ${testToken}`)
            .send({ account_name: 'NonExistingAccount' });

        expect(res.statusCode).toEqual(404);
        expect(res.body.message).toEqual('Account not found');
    });
});
