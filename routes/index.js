require('dotenv').config();
const express = require('express');
const axios = require('axios');
const fs = require('fs');

const ba64 = require('ba64');
const path = require('path');
const { WebClient } = require('@slack/web-api');
const { snippetView, storeSnippet } = require('../slack/helper');

const config = require('../config/');

const twitterClient = require('../config/twitter');

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
  const description = values.description.description
    ? values.description.description.value
    : '';
  const sourceUrl = values.sourceUrl.sourceUrl
    ? values.sourceUrl.sourceUrl.value
    : '';
  const tags = values.tags.tags ? values.tags.tags.value : '';
  const lang = values.lang.lang ? values.lang.lang.value : '';
  const email = values.email.email ? values.email.email.value : '';
  await storeSnippet(web, payload.user.id, {
    title,
    content,
    description,
    sourceUrl,
    tags,
    lang,
    email,
  });
  //   closeModal(web, { title: 'Success', message: 'Snippet created successfully', viewId });
});

router.get('/slack/auth', async (req, res) => {
  const { code } = req.query;
  if (code) {
    const {
      slack: { clientId, secret },
    } = config;
    const {
      data: { user },
    } = await axios.get(
      `https://slack.com/api/oauth.access?client_id=${clientId}&client_secret=${secret}&code=${code}`,
    );
    const { id, email, name, image_72: avatar } = user;
    res.status(200).send({
      id,
      email,
      name,
      avatar,
    });
  }
});

/**
 * Twitter
 */
const deleteImage = (imagePath) => {
  if (fs.existsSync(imagePath)) {
    // file exists
    fs.unlink(imagePath, () => {});
  }
};

router.post('/imagetotweet', async (req, res) => {
  const { dataUrl, shareId } = req.body;
  const imageName = Date.now();
  const imagePath = path.join(__dirname, `../static/tweet-images/${imageName}`);
  try {
    ba64.writeImage(imagePath, dataUrl, (err) => {
      if (!err) {
        fs.readFile(`${imagePath}.png`, (fileReadError, image) => {
          if (!fileReadError) {
            twitterClient.post(
              'media/upload',
              {
                media: image,
              },
              (mediaError, media) => {
                if (!mediaError) {
                  const status = {
                    status: `Codelify image - ShareId ${shareId}`,
                    media_ids: media.media_id_string,
                  };
                  twitterClient.post(
                    'statuses/update',
                    status,
                    (statusError, response) => {
                      if (!statusError) {
                        deleteImage(`${imagePath}.png`);
                        res.status(200).json({
                          message: response.entities.media[0].display_url,
                        });
                      }
                    },
                  );
                } else {
                  throw mediaError;
                }
              },
            );
          } else {
            throw fileReadError;
          }
        });
      } else {
        throw err;
      }
    });
  } catch (error) {
    deleteImage(`${imagePath}.png`);
    res.status(500).json({ error: error.message });
  }
});

router.get('/test', (req, res) => {
  res.status(200).json({ message: 'welcome' });
});

module.exports = router;
