const { skip } = require('graphql-resolvers');
const { AuthenticationError, UserInputError } = require('apollo-server-express');
const { isEmail } = require('validator');
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

const validateRegistration = (_, { input: { email, password } }) => {
  if (!email || !isEmail(email)) {
    throw new UserInputError('Invalid email specified');
  } else if (!password || password.length < 6) {
    throw new UserInputError('The password length must be at least 6 characters');
  } else return skip;
};

module.exports = {
  isAuthenticated,
  validateRegistration,
};
