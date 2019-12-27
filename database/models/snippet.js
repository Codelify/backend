module.exports = (sequelize, DataTypes) => {
  const Snippet = sequelize.define(
    'Snippet',
    {
      uid: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
      },
      userId: DataTypes.INTEGER,
      title: DataTypes.STRING,
      description: DataTypes.TEXT,
      content: DataTypes.TEXT,
      lang: DataTypes.STRING,
      sourceUrl: DataTypes.STRING,
      tags: DataTypes.ARRAY(DataTypes.STRING),
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
