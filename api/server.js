const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const models = require('../database/models/');
const typeDefs = require('../schemas/');
const resolvers = require('../resolvers/');
const dataSources = require('../datasources/');
const { verifyUserToken } = require('../helpers/jwt');

const app = express();

const context = async ({ req }) => {
  const token = (req.headers && req.headers.authorization) || '';
  const user = await verifyUserToken(token);
  const userData = (user && user.get()) || null;
  return {
    models,
    user: userData,
  };
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context,
  dataSources,
  introspection: true,
  playground: true,
});

server.applyMiddleware({ app });

module.exports = {
  app,
  server,
};
