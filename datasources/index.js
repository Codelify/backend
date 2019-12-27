const UserDataSource = require('./user');

const dataSources = () => ({
  User: new UserDataSource(),
});

module.exports = dataSources;
