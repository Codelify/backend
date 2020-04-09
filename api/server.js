const express = require("express");
const bodyParser = require("body-parser");
const { ApolloServer } = require("apollo-server-express");
const cors = require("cors");
const morgan = require("morgan");
const models = require("../database/models/");
const typeDefs = require("../schemas/");
const resolvers = require("../resolvers/");
const dataSources = require("../datasources/");
const { verifyUserToken } = require("../helpers/jwt");
const routes = require("../routes/");
const logger = require("../config/winston");

const app = express();

app.use(morgan("combined", { stream: logger.stream }));
app.use(cors());
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));

app.use(routes);
const context = async ({ req }) => {
  const token = (req.headers && req.headers.authorization) || "";
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
