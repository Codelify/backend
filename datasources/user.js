require('dotenv').config();
const { DataSource } = require('apollo-datasource');
const autoBind = require('auto-bind');
const { ApolloError } = require('apollo-server-express');
const { generateToken } = require('../helpers/jwt');
/**
 *
 *
 * @class User
 * @extends {DataSource}
 */
class User extends DataSource {
  constructor() {
    super();
    autoBind(this);
  }

  initialize({ context }) {
    this.models = context.models;
  }

  /**
   *
   *
   * @param {object} userData
   * @returns User
   * @memberof User
   * @throws ApolloError
   */
  async register(userData) {
    const user = await this.findBy('email', userData.email);
    if (user) {
      throw new ApolloError(
        'An account with the specified email already exists',
        'CONFLICT',
      );
    }
    try {
      const newUser = await this.models.User.create(userData);
      const token = generateToken({ _uid: newUser.uid });
      return { ...newUser.get(), token };
    } catch (err) {
      throw new ApolloError(err.message, 'INTERNAL_SERVER_ERROR');
    }
  }

  /**
   * Find a user from the database with the given key/value
   *
   * @param {*} key - the attribute name
   * @param {*} value - the attribute value
   * @returns User | null
   * @memberof User
   */
  async findBy(key, value) {
    return this.models.User.findOne({ where: { [key]: value } });
  }

  /**
   * Log in user
   *
   * @param {string} { email, password }
   * @returns object
   * @memberof User
   * @throws ApolloError
   */
  async login({ email, password }) {
    const user = await this.findBy('email', email);
    if (user) {
      const isValidPassword = await user.validatePassword(password);
      if (isValidPassword) {
        const token = generateToken({ _uid: user.uid });
        return { ...user.get(), token };
      }
    }
    throw new ApolloError(
      'Invalid credential provided',
      'INVALID_AUTH_CREDENTIAL',
    );
  }

  getUserDetails(userId) {
    return this.models.User.findOne({
      where: { id: userId },
      include: [
        {
          model: this.models.Snippet,
          as: 'snippets',
        },
      ],
    });
  }
}

module.exports = User;
