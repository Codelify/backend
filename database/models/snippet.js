module.exports = (sequelize, DataTypes) => {
  const Snippet = sequelize.define(
    'Snippet',
    {
      uid: DataTypes.STRING,
      userId: DataTypes.INTEGER,
      title: DataTypes.STRING,
      description: DataTypes.TEXT,
      content: DataTypes.TEXT,
      lang: DataTypes.STRING,
      sourceUrl: DataTypes.STRING,
      tags: DataTypes.ARRAY,
    },
    {},
  );
  Snippet.associate = function(models) {
    Snippet.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'owner',
      onDelete: 'CASCADE',
    });
  };
  return Snippet;
};
