
require('dotenv').config();
const express = require('express');

const { WebClient } = require('@slack/web-api');
const {
  snippetView, storeSnippet,
} = require('../slack/helper');

const router = express.Router();

// Read a token from the environment variables
const token = process.env.SLACK_TOKEN;

// Initialize
const web = new WebClient(token, { retries: 0 });
let triggerId;
router.post('/commands/snippet', (req, res) => {
  const { trigger_id: trigger } = req.body;
  triggerId = trigger;
  (async () => {
  // Open a modal.
    // Find more arguments and details of the response: https://api.slack.com/methods/views.open
    await web.views.open({
      trigger_id: triggerId,
      view: snippetView,
    });

    res.status(200).send('');
  })();
});

router.post('/slack/interactions', async (req, res) => {
  const payload = JSON.parse(req.body.payload);

  res.status(200).send({ response_action: 'clear' });

  // save the snippet
  const { values } = payload.view.state;
  const title = values.title.title.value;
  const content = values.content.content.value;
  const description = values.description.description ? values.description.description.value : '';
  const sourceUrl = values.sourceUrl.sourceUrl ? values.sourceUrl.sourceUrl.value : '';
  const tags = values.tags.tags ? values.tags.tags.value : '';
  const lang = values.lang.lang ? values.lang.lang.value : '';
  const email = values.email.email ? values.email.email.value : '';
  await storeSnippet(web, payload.user.id, {
    title, content, description, sourceUrl, tags, lang, email,
  });
//   closeModal(web, { title: 'Success', message: 'Snippet created successfully', viewId });
});

module.exports = router;
