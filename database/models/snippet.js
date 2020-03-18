const { encrypt } = require('../../helpers/crypto');

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
      isFav: DataTypes.BOOLEAN,
      archivedAt: DataTypes.DATE,
      shareId: DataTypes.STRING,
      isPublic: DataTypes.BOOLEAN,
    },
    {},
  );
  Snippet.afterCreate(async (snippet) => {
    // eslint-disable-next-line no-param-reassign
    const shareId = encrypt(snippet.id);
    snippet.update({ shareId });
  });
  Snippet.associate = (models) => {
    Snippet.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'owner',
      onDelete: 'CASCADE',
    });
  };
  return Snippet;
};
