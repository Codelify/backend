module.exports = {
  up(queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.addColumn(
        'Snippets',
        'isPublic',
        {
          type: Sequelize.BOOLEAN,
          defaultValue: false,
        },
      ),
    ]);
  },

  down(queryInterface, Sequelize) {
    // logic for reverting the changes
    return Promise.all([
      queryInterface.removeColumn('Snippets', 'isPublic'),
    ]);
  },
};
