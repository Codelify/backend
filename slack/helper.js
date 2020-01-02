const models = require('../database/models/');

const snippetView = {
  type: 'modal',
  title: {
    type: 'plain_text',
    text: 'Save a Snippet',
  },
  submit: {
    type: 'plain_text',
    text: 'Submit',
  },
  notify_on_close: true,
  blocks: [
    {
      type: 'section',
      text: {
        type: 'plain_text',
        text:
          ':wave: Saving a snippet saves you time, fill the form below to save your snippet.',
        emoji: true,
      },
    },
    {
      type: 'divider',
    },
    {
      type: 'input',
      block_id: 'email',
      label: {
        type: 'plain_text',
        text: 'Your Codelify Email?',
        emoji: true,
      },
      element: {
        type: 'plain_text_input',
        multiline: false,
        action_id: 'email',
      },
    },
    {
      type: 'input',
      block_id: 'title',
      label: {
        type: 'plain_text',
        text: 'Snippet Title?',
        emoji: true,
      },
      element: {
        type: 'plain_text_input',
        multiline: false,
        action_id: 'title',
      },
    },
    {
      type: 'input',
      block_id: 'description',
      label: {
        type: 'plain_text',
        text: 'Description',
        emoji: true,
      },
      element: {
        type: 'plain_text_input',
        multiline: true,
        action_id: 'description',
      },
      optional: true,
    },
    {
      type: 'input',
      block_id: 'content',
      label: {
        type: 'plain_text',
        text: 'Content?',
        emoji: true,
      },
      element: {
        type: 'plain_text_input',
        multiline: true,
        action_id: 'content',
      },
    },
    {
      type: 'input',
      block_id: 'sourceUrl',
      label: {
        type: 'plain_text',
        text: 'Source URL?',
        emoji: true,
      },
      element: {
        type: 'plain_text_input',
        multiline: false,
        action_id: 'sourceUrl',
      },
      optional: true,
    },
    {
      type: 'input',
      block_id: 'tags',
      label: {
        type: 'plain_text',
        text: 'Tags',
        emoji: true,
      },
      element: {
        type: 'plain_text_input',
        multiline: false,
        action_id: 'tags',
      },
      optional: true,
    },
    {
      type: 'input',
      block_id: 'lang',
      label: {
        type: 'plain_text',
        text: 'Language',
        emoji: true,
      },
      element: {
        type: 'plain_text_input',
        multiline: false,
        action_id: 'lang',
      },
    },
  ],
};

const closeModal = async (webClient, options) => {
  // Update a modal
  // Find more arguments and details of the response: https://api.slack.com/methods/views.update
  await webClient.views.update({
    view_id: options.viewId,
    response_action: 'clear',
    view: {
      type: 'modal',
      title: {
        type: 'plain_text',
        text: options.title,
      },
      blocks: [
        {
          type: 'section',
          text: {
            type: 'plain_text',
            text: options.message,
          },
        },
      ],
    },
  });
};

const successView = {
  type: 'modal',
  title: {
    type: 'plain_text',
    text: 'Workplace check-in',
    emoji: true,
  },
  close: {
    type: 'plain_text',
    text: 'Cancel',
    emoji: true,
  },
  blocks: [
    {
      type: 'section',
      text: {
        type: 'plain_text',
        text:
          ":wave: Hey David!\n\nWe'd love to hear from you how we can make this place the best place you’ve ever worked.",
        emoji: true,
      },
    },
  ],
};

const storeSnippet = async (webClient, userId, options) => {
  const {
    email,
    title,
    description = '',
    content = '',
    sourceUrl = '',
    tags = '',
    lang = '',
  } = options;
  const user = await models.User.findOne({ where: { email } });
  if (!user) {
    await webClient.chat.postMessage({
      text: `The account with email address *${email}* does not exist`,
      channel: userId,
    });
  } else {
    const snippet = await models.Snippet.create({
      userId: user.id,
      title,
      description,
      content,
      sourceUrl,
      lang,
      ...(tags && { tags: tags.split(',') }),
    });

    if (snippet) {
      await webClient.chat.postMessage({
        text: `your snippet titled *${title}* has been created`,
        channel: userId,
      });
    } else {
      await webClient.chat.postMessage({
        text: `your snippet titled *${title}* could not be created`,
        channel: userId,
      });
    }
  }
};
module.exports = {
  snippetView,
  closeModal,
  successView,
  storeSnippet,
};
