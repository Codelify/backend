require('dotenv').config();
const { DataSource } = require('apollo-datasource');
const autoBind = require('auto-bind');
const { ApolloError, ForbiddenError } = require('apollo-server-express');
const { verifyUserToken } = require('../helpers/jwt');
const { decrypt } = require('../helpers/crypto');

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
  async createSnippet(snippetData, token) {
    try {
      const user = await verifyUserToken(token);
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
  async getAuthUserSnippets(token) {
    const user = await verifyUserToken(token);
    return this.models.Snippet.findAll({
      where: { userId: user.id },
      include: [
        {
          model: this.models.User,
          as: 'owner',
        },
      ],
      order: [
        ['createdAt', 'DESC'],
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
      order: [
        ['createdAt', 'DESC'],
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
    const id = Number(snippetId) ? snippetId : decrypt(snippetId);
    return this.models.Snippet.findOne({
      where: { id },
      include: [
        {
          model: this.models.User,
          as: 'owner',
        },
      ],
    });
  }

  async deleteSnippet({ snippetId, archive = true }, token) {
    const user = await verifyUserToken(token);
    const snippet = await this.models.Snippet.findOne({ where: { id: snippetId } });
    if (!snippet) {
      throw new ApolloError('Snippet with the specified ID was not found');
    }
    if (snippet.userId !== user.id) {
      throw new ForbiddenError('You can only delete a snippet created by you');
    }
    try {
      if (!archive) {
        snippet.destroy();
        return { status: 'success', message: 'Snippet deleted successfully' };
      }
      snippet.update({ archivedAt: Date.now() });
      return { status: 'success', message: 'Snippet archived successfully' };
    } catch (err) {
      throw new ApolloError(err.message);
    }
  }

  async updateSnippet(snippetId, snippetData, token) {
    const user = await verifyUserToken(token);
    const snippet = await this.models.Snippet.findOne({ where: { id: snippetId } });
    if (!snippet) {
      throw new ApolloError('Snippet with the specified ID was not found');
    }
    if (snippet.userId !== user.id) {
      throw new ForbiddenError('You can only delete a snippet created by you');
    }
    try {
      const updatedSnippet = await snippet.update(snippetData);
      if (updatedSnippet) {
        return updatedSnippet;
      }
      throw new ApolloError('Snippet could not be updated!');
    } catch (err) {
      throw new ApolloError(err.message);
    }
  }
}

module.exports = Snippet;
