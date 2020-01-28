module.exports = {
  up(queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.addColumn(
        'Snippets',
        'isFav',
        {
          type: Sequelize.BOOLEAN,
          defaultValue: false,
        },
      ),
      queryInterface.addColumn(
        'Snippets',
        'archivedAt',
        {
          type: Sequelize.DATE,
          allowNull: true,
        },
      ),
    ]);
  },

  down(queryInterface, Sequelize) {
    // logic for reverting the changes
    return Promise.all([
      queryInterface.removeColumn('Snippets', 'isFav'),
      queryInterface.removeColumn('Snippets', 'archivedAt'),
    ]);
  },
};
