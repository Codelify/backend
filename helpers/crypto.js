
const encrypt = (data) => {
  const encryptedId = Buffer.from(String(data)).toString('base64');
  const rand = Math.random().toString(36).substring(8).toUpperCase();
  return `${encryptedId}-!${rand}`;
};

const decrypt = (data) => {
  const decrypted = Buffer.from(data, 'base64').toString('ascii');
  const id = decrypted.split('-!')[0];
  return Number(id);
};

module.exports = { encrypt, decrypt };
