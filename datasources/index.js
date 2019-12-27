const UserDataSource = require('./user');
const SnippetDataSource = require('./snippet');

const dataSources = () => ({
  User: new UserDataSource(),
  Snippet: new SnippetDataSource(),
});

module.exports = dataSources;
