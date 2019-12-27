
const userResolver = {
  Query: {
    async getAllUsers(root, args, { dataSource: { User } }) {
      return User.getAllUsers();
    },

    async getUserById(_, { userId }, { dataSource: { User } }) {
      return User.getUserById(userId);
    },
  },
};

module.exports = userResolver;
