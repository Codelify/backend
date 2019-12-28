const { combineResolvers } = require('graphql-resolvers');
const { isAuthenticated } = require('../middleware/auth');

const userResolver = {
  Query: {
    async getAllUsers(root, args, { dataSources: { User } }) {
      return User.getAllUsers();
    },

    async getUserById(_, { userId }, { dataSources: { User } }) {
      return User.getUserById(userId);
    },
    getUserDetails: combineResolvers(
      isAuthenticated,
      (_, __, { dataSources: { User }, user }) => User.getUserDetails(user.id),
    ),
  },

  Mutation: {
    async register(_, { input: userData }, { dataSources: { User } }) {
      return User.register(userData);
    },
    async login(_, { input: userData }, { dataSources: { User } }) {
      return User.login(userData);
    },
    async authWithGoogle(_, { input }, { dataSources: { User } }) {
      return User.authWithGoogle(input);
    },
  },
  User: {
    snippets(user) {
      return user.getSnippets();
    },
  },
};

module.exports = userResolver;
