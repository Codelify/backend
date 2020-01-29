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
      (_, { token = '' }, { dataSources: { Snippet } }) => Snippet.getAuthUserSnippets(token),
    ),

    getSnippetsByUserId(_, { userId }, { dataSources: { Snippet } }) {
      return Snippet.getSnippetsByUserId(userId);
    },
  },
  Mutation: {
    createSnippet: combineResolvers(
      isAuthenticated,
      validateCreateSnippet,
      (_, { input: snippetData, token = '' },
        {
          dataSources: { Snippet },
        }) => Snippet.createSnippet(snippetData, token),
    ),
    deleteSnippet: combineResolvers(
      isAuthenticated,
      (_, { snippetId, token = '', archive = true },
        {
          dataSources: { Snippet },
        }) => Snippet.deleteSnippet({ snippetId, archive }, token),
    ),
    updateSnippet: combineResolvers(
      isAuthenticated,
      (_, { snippetId, input, token = '' },
        {
          dataSources: { Snippet },
        }) => Snippet.updateSnippet(snippetId, input, token),
    ),
  },
  Snippet: {
    owner(snippet) {
      return snippet.getOwner();
    },
  },
};

module.exports = snippetResolver;
