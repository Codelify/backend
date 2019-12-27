require('dotenv').config();
const { DataSource } = require('apollo-datasource');
const autoBind = require('auto-bind');
const { ApolloError } = require('apollo-server-express');

/**
 *
 *
 * @class Snippet
 * @extends {DataSource}
 */
class Snippet extends DataSource {
  constructor() {
    super();
    autoBind(this);
  }

  initialize({ context }) {
    this.models = context.models;
  }

  /**
   * Create new snippet
   *
   * @param {object} snippetData
   * @param {object} user
   * @returns
   * @memberof Snippet
   */
  createSnippet(snippetData, user) {
    try {
      return this.models.Snippet.create({
        ...snippetData,
        userId: user.id,
      });
    } catch (err) {
      throw new ApolloError(err.message);
    }
  }

  /**
 * Get all snippets
 *
 * @returns
 * @memberof Snippet
 */
  getAllSnippets() {
    return this.models.Snippet.findAll({
      include: [
        {
          model: this.models.User,
          as: 'owner',
        },
      ],
    });
  }

  /**
 * Get the snippets of the logged in user
 *
 * @param {*} user
 * @returns
 * @memberof Snippet
 */
  getAuthUserSnippets(user) {
    return this.models.Snippet.findAll({
      where: { userId: user.id },
      include: [
        {
          model: this.models.User,
          as: 'owner',
        },
      ],
    });
  }

  /**
 * Get snippets by userId
 *
 * @param {*} userId
 * @returns
 * @memberof Snippet
 */
  getSnippetsByUserId(userId) {
    return this.models.Snippet.findAll({
      where: { userId },
      include: [
        {
          model: this.models.User,
          as: 'owner',
        },
      ],
    });
  }

  /**
 * Get a single snippet details
 *
 * @param {*} snippetId
 * @returns
 * @memberof Snippet
 */
  getSnippetDetails(snippetId) {
    return this.models.Snippet.findOne({
      where: { id: snippetId },
      include: [
        {
          model: this.models.User,
          as: 'owner',
        },
      ],
    });
  }
}

module.exports = Snippet;
