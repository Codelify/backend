const request = require('supertest');

const { server } = require('../api/server');

describe('Routes', () => {
  it('should show that the server is up', async () => {
    const res = await request(server).get('/test');
    expect(res.status).toEqual(200);
  });
});
