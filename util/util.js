const models = require('../database/models');

const { encrypt } = require('../helpers/crypto');


(async () => {
  const snippets = await models.Snippet.findAll();
  snippets.forEach((snippet) => {
    if (!snippet.shareId) {
      const shareId = encrypt(snippet.id);
      snippet.update({ shareId });
    }
  });
}
)();
