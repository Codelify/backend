const express = require('express');
const bodyParser = require('body-parser');
const { ApolloServer } = require('apollo-server-express');
const models = require('../database/models/');
const typeDefs = require('../schemas/');
const resolvers = require('../resolvers/');
const dataSources = require('../datasources/');
const { verifyUserToken } = require('../helpers/jwt');
const routes = require('../routes/');

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(routes);
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
