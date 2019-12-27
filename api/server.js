const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const models = require('../database/models/');
const typeDefs = require('../schemas/');
const resolvers = require('../resolvers/');
const dataSources = require('../datasources/');

const app = express();

const context = () => ({
  models,
});

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context,
  dataSources,
});

server.applyMiddleware({ app });

module.exports = {
  app,
  server,
};
