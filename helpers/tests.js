// eslint-disable-next-line import/no-extraneous-dependencies
const request = require('supertest');

const { server } = require('../api/server');

const graphqlQuery = (graphql, authToken = '') => request(server).post('/graphql').send({ query: graphql }).set('Authorization', authToken);

module.exports = { graphqlQuery };
