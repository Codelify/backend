const snippetResolver = {
  Query: {
    async getAllSnippets(root, args, { dataSource: { Snippet } }) {
      return Snippet.getAllSnippets();
    },

    async getSnippetDetails(_, { snippetId }, { dataSource: { Snippet } }) {
      return Snippet.getSnippetDetails(snippetId);
    },
  },
};

module.exports = snippetResolver;
