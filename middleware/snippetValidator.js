const { skip } = require('graphql-resolvers');
const { UserInputError } = require('apollo-server-express');

/**
 * Validate Survey
 *
 * @param {*} parent
 * @param {*} { input }
 * @param {*} ctx
 * @returns
 */
const validateCreateSnippet = (_, { input }, ctx) => {
  const { title, sourceUrl, content } = input;
  if (!title) {
    throw new UserInputError('You must specify the title of the snippet', {
      invalidArgs: 'title',
    });
  }
  if (!sourceUrl && !content) {
    throw new UserInputError(
      'You must specify either the source url or the content of the snippet',
      {
        invalidArgs: ['title', 'content'],
      },
    );
  }
  return skip;
};

module.exports = {
  validateCreateSnippet,
};
