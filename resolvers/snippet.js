const { combineResolvers } = require('graphql-resolvers');
const { isAuthenticated } = require('../middleware/auth');
const { validateCreateSnippet } = require('../middleware/snippetValidator');

const snippetResolver = {
  Query: {
    async getAllSnippets(_, args, { dataSources: { Snippet } }) {
      return Snippet.getAllSnippets();
    },

    async getSnippetDetails(_, { snippetId }, { dataSources: { Snippet } }) {
      return Snippet.getSnippetDetails(snippetId);
    },
    getAuthUserSnippets: combineResolvers(
      isAuthenticated,
      (_, __, { dataSources: { Snippet }, user }) => Snippet.getAuthUserSnippets(user),
    ),

    getSnippetsByUserId(_, { userId }, { dataSources: { Snippet } }) {
      return Snippet.getSnippetsByUserId(userId);
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
    deleteSnippet: combineResolvers(
      isAuthenticated,
      (_, { snippetId },
        {
          dataSources: { Snippet },
          user,
        }) => Snippet.deleteSnippet(snippetId, user),
    ),
  },
  Snippet: {
    owner(snippet) {
      return snippet.getOwner();
    },
  },
};

module.exports = snippetResolver;
