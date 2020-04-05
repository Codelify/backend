
const encrypt = (data) => {
  const encryptedId = Buffer.from(String(data)).toString('base64');
  const rand = Math.random().toString(36).substring(8).toUpperCase();
  return `${encryptedId}-!${rand}`;
};

const decrypt = (data) => {
  const id = Buffer.from(data.split('-!')[0], 'base64').toString('ascii');
  return Number(id);
};


module.exports = { encrypt, decrypt };
