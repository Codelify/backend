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
      (_, { token }, { dataSources: { User } }) => User.getUserDetails(token),
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
    async updateProfile(_, { token, input }, { dataSources: { User } }) {
      return User.updateProfile(input, token);
    },
  },
  User: {
    snippets(user) {
      return user.getSnippets();
    },
  },
};

module.exports = userResolver;
