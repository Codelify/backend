module.exports = {
  up(queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.addColumn(
        'Users',
        'enableNewsletter',
        {
          type: Sequelize.BOOLEAN,
          defaultValue: true,
        },
      ),
    ]);
  },

  down(queryInterface, Sequelize) {
    // logic for reverting the changes
    return Promise.all([
      queryInterface.removeColumn('Users', 'enableNewsletter'),
    ]);
  },
};
