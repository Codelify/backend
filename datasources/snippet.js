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

  createSnippet(snippetData, user) {
    try {
      return this.models.Snippet.create({
        ...snippetData, userId: user.id,
      });
    } catch (err) {
      throw new ApolloError(err.message);
    }
  }
}

module.exports = Snippet;
