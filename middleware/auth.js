const { skip } = require('graphql-resolvers');
const { AuthenticationError } = require('apollo-server-express');
const { verifyUserToken } = require('../helpers/jwt');

/**
 *
 *
 * @param {*} parent
 * @param {*} args
 * @param {*} { user }
 * @returns
 */
const isAuthenticated = async (_, { token = '' }) => {
  const user = await verifyUserToken(token);
  if (!user) {
    throw new AuthenticationError(
      'Unauthorized Request, Authentication required',
    );
  }
  return skip;
};

module.exports = {
  isAuthenticated,
};
