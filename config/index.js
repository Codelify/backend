require('dotenv').config();

module.exports = {
  slack: {
    clientId: process.env.SLACK_CLIENT_ID,
    secret: process.env.SLACK_CLIENT_SECRET,
  },
};
