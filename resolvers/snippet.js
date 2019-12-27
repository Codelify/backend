const { combineResolvers } = require('graphql-resolvers');
const { isAuthenticated } = require('../middleware/auth');
const { validateCreateSnippet } = require('../middleware/snippetValidator');

const snippetResolver = {
  Query: {
    async getAllSnippets(root, args, { dataSources: { Snippet } }) {
      return Snippet.getAllSnippets();
    },

    async getSnippetDetails(_, { snippetId }, { dataSources: { Snippet } }) {
      return Snippet.getSnippetDetails(snippetId);
    },
  },
  Mutation: {
    createSnippet: combineResolvers(
      isAuthenticated,
      validateCreateSnippet,
      (_, { input: snippetData },
        {
          dataSources: { Snippet },
          user,
        }) => Snippet.createSnippet(snippetData, user),
    ),
  },
};

module.exports = snippetResolver;
