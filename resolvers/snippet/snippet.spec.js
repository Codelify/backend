const { sequelize } = require('../../database/models');
const { graphqlQuery } = require('../../helpers/tests');
const { generateToken } = require('../../helpers/jwt');
const models = require('../../database/models');

beforeEach(async () => {
  await sequelize.truncate();
});

describe('SNIPPETS', () => {
  describe('Create snippets', () => {
    it('should fail if user is not authenticated', async () => {
      const response = await graphqlQuery(`
                  mutation {
                      createSnippet(input: {
                          title: "test title",
                          description: "test description"
                      }, token: "") {
                          id
                          title
                      }
                  }
              `);
      const body = JSON.parse(response.text);
      expect(body).toHaveProperty('errors');
      expect(body.errors[0].message).toEqual(
        'Unauthorized Request, Authentication required',
      );
    });

    it('should fail if token is invalid', async () => {
      const response = await graphqlQuery(`
                    mutation {
                        createSnippet(input: {
                            title: "test title",
                            description: "test description"
                        }, token: "gshjjjhhjsdhj") {
                            id
                            title
                        }
                    }
                `);
      const body = JSON.parse(response.text);
      expect(body).toHaveProperty('errors');
      expect(body.errors[0].message).toMatch(/jwt/);
    });
    it('should fail if title is empty', async () => {
      const user = await models.User.create({
        email: 'test@test.com',
        password: 'password',
      });
      const token = generateToken({ _uid: user.uid });
      const response = await graphqlQuery(`
            mutation {
                createSnippet(input: {
                    description: "test description"
                }, token: "${token}") {
                    id
                    title
                }
            }
        `);
      const body = JSON.parse(response.text);
      expect(body).toHaveProperty('errors');
      expect(body.errors[0].message).toEqual(
        'You must specify the title of the snippet',
      );
    });

    it('should fail if both sourceUrl and content are empty', async () => {
      const user = await models.User.create({
        email: 'test@test.com',
        password: 'password',
      });
      const token = generateToken({ _uid: user.uid });
      const response = await graphqlQuery(`
              mutation {
                  createSnippet(input: {
                      title: "test title",
                      description: "test description"
                  }, token: "${token}") {
                      id
                      title
                  }
              }
          `);
      const body = JSON.parse(response.text);
      expect(body).toHaveProperty('errors');
      expect(body.errors[0].message).toEqual(
        'You must specify either the source url or the content of the snippet',
      );
    });

    it('should fail if title is empty', async () => {
      const user = await models.User.create({
        email: 'test@test.com',
        password: 'password',
      });
      const token = generateToken({ _uid: user.uid });
      const response = await graphqlQuery(`
            mutation {
                createSnippet(input: {
                    description: "test description",
                    title: "test title",
                    content: "<p>Hi there</p>"
                }, token: "${token}") {
                    id
                    title
                }
            }
        `);
      const body = JSON.parse(response.text);
      expect(body).toHaveProperty('data.createSnippet');
      expect(body.data.createSnippet.title).toEqual('test title');
    });
    it('should seed snippet from gist', async () => {
      const user = await models.User.create({
        email: 'test@test.com',
        password: 'password',
      });
      const token = generateToken({ _uid: user.uid });
      const response = await graphqlQuery(`
              mutation {
                  createSnippet(input: {
                      description: "test description",
                      title: "test title",
                      gistId: "CXCRR6wwrr",
                      content: "<p>Hi there</p>"
                  }, token: "${token}") {
                      id
                      title
                  }
              }
          `);
      const body = JSON.parse(response.text);
      expect(body).toHaveProperty('data.createSnippet');
      expect(body.data.createSnippet.title).toEqual('test title');
    });
    it('should return the snippet if it is already seeded from gist', async () => {
      const user = await models.User.create({
        email: 'test@test.com',
        password: 'password',
      });
      await models.Snippet.create({
        description: 'test description',
        title: 'test title',
        gistId: 'dummyID23',
        content: '<p>Hi there</p>',
        userId: user.id,
      });
      const token = generateToken({ _uid: user.uid });
      const response = await graphqlQuery(`
                mutation {
                    createSnippet(input: {
                        description: "test description",
                        title: "test title",
                        gistId: "dummyID23",
                        content: "<p>Hi there</p>"
                    }, token: "${token}") {
                        id
                        title
                    }
                }
            `);
      const body = JSON.parse(response.text);
      expect(body).toHaveProperty('data.createSnippet');
      expect(body.data.createSnippet.title).toEqual('test title');
    });
  });

  describe('Snippets Queries', () => {
    it('should fetch all snippets', async () => {
      const user = await models.User.create({
        email: 'test@test.com',
        password: 'password',
      });
      await models.Snippet.create({
        description: 'test description',
        title: 'test title',
        gistId: 'dummyID23',
        content: '<p>Hi there</p>',
        userId: user.id,
      });
      const response = await graphqlQuery(`
                query {
                    getAllSnippets {
                        id
                        title
                        owner {
                            id
                            email
                        }
                    }
                }
            `);
      const body = JSON.parse(response.text);
      expect(body).toHaveProperty('data.getAllSnippets');
      expect(body.data.getAllSnippets[0].title).toEqual('test title');
      expect(body.data.getAllSnippets[0].owner.email).toEqual('test@test.com');
    });

    it('should fetch authenticated user snippets', async () => {
      const user = await models.User.create({
        email: 'test@test.com',
        password: 'password',
      });
      await models.Snippet.create({
        description: 'test description',
        title: 'test title',
        gistId: 'dummyID23',
        content: '<p>Hi there</p>',
        userId: user.id,
      });
      const token = generateToken({ _uid: user.uid });
      const response = await graphqlQuery(`
                  query {
                    getAuthUserSnippets(token: "${token}") {
                          id
                          title
                      }
                  }
              `);
      const body = JSON.parse(response.text);
      expect(body).toHaveProperty('data.getAuthUserSnippets');
      expect(body.data.getAuthUserSnippets[0].title).toEqual('test title');
    });
    it('should fetch snippets by userId', async () => {
      const user = await models.User.create({
        email: 'test@test.com',
        password: 'password',
      });
      await models.Snippet.create({
        description: 'test description',
        title: 'test title',
        gistId: 'dummyID23',
        content: '<p>Hi there</p>',
        userId: user.id,
      });
      const response = await graphqlQuery(`
                    query {
                        getSnippetsByUserId(userId: ${user.id}) {
                            id
                            title
                        }
                    }
                `);
      const body = JSON.parse(response.text);
      expect(body).toHaveProperty('data.getSnippetsByUserId');
      expect(body.data.getSnippetsByUserId[0].title).toEqual('test title');
    });

    it('should get details of snippet by id', async () => {
      const user = await models.User.create({
        email: 'test@test.com',
        password: 'password',
      });
      const snippet = await models.Snippet.create({
        description: 'test description',
        title: 'test title',
        gistId: 'dummyID23',
        content: '<p>Hi there</p>',
        userId: user.id,
      });
      const response = await graphqlQuery(`
                      query {
                        getSnippetDetails(snippetId: "${snippet.shareId}") {
                              id
                              title
                          }
                      }
                  `);
      const body = JSON.parse(response.text);
      expect(body).toHaveProperty('data.getSnippetDetails');
      expect(body.data.getSnippetDetails.title).toEqual('test title');
    });
  });

  describe('Delete snippet', () => {
    it('should fail if snippet does not exist', async () => {
      const user = await models.User.create({
        email: 'test@test.com',
        password: 'password',
      });
      const token = generateToken({ _uid: user.uid });
      const response = await graphqlQuery(`
                      mutation {
                        deleteSnippet(snippetId: 33, token: "${token}") {
                              status
                              message
                          }
                      }
                  `);
      const body = JSON.parse(response.text);
      expect(body).toHaveProperty('errors');
      expect(body.errors[0].message).toEqual(
        'Snippet with the specified ID was not found',
      );
    });

    it('should fail if user tries to delete another user snippet', async () => {
      const user = await models.User.create({
        email: 'test@test.com',
        password: 'password',
      });
      const snippet = await models.Snippet.create({
        description: 'test description',
        title: 'test title',
        gistId: 'dummyID23',
        content: '<p>Hi there</p>',
        userId: 33,
      });
      const token = generateToken({ _uid: user.uid });
      const response = await graphqlQuery(`
                        mutation {
                          deleteSnippet(snippetId: ${snippet.id}, token: "${token}") {
                                status
                                message
                            }
                        }
                    `);
      const body = JSON.parse(response.text);
      expect(body).toHaveProperty('errors');
      expect(body.errors[0].message).toEqual(
        'You can only delete a snippet created by you',
      );
    });
    it('should archive a snippet', async () => {
      const user = await models.User.create({
        email: 'test@test.com',
        password: 'password',
      });
      const snippet = await models.Snippet.create({
        description: 'test description',
        title: 'test title',
        gistId: 'dummyID23',
        content: '<p>Hi there</p>',
        userId: user.id,
      });
      const token = generateToken({ _uid: user.uid });
      const response = await graphqlQuery(`
                          mutation {
                            deleteSnippet(snippetId: ${snippet.id}, archive: true, token: "${token}") {
                                  status
                                  message
                              }
                          }
                      `);
      const body = JSON.parse(response.text);
      expect(body).toHaveProperty('data');
      expect(body.data.deleteSnippet.status).toEqual('success');
    });
    it('should delete a snippet completely', async () => {
      const user = await models.User.create({
        email: 'test@test.com',
        password: 'password',
      });
      const snippet = await models.Snippet.create({
        description: 'test description',
        title: 'test title',
        gistId: 'dummyID23',
        content: '<p>Hi there</p>',
        userId: user.id,
      });
      const token = generateToken({ _uid: user.uid });
      const response = await graphqlQuery(`
                            mutation {
                              deleteSnippet(snippetId: ${snippet.id}, archive: false, token: "${token}") {
                                    status
                                    message
                                }
                            }
                        `);
      const body = JSON.parse(response.text);
      expect(body).toHaveProperty('data');
      expect(body.data.deleteSnippet.status).toEqual('success');
    });
    it('should fail if token is invalid', async () => {
      const user = await models.User.create({
        email: 'test@test.com',
        password: 'password',
      });
      const snippet = await models.Snippet.create({
        description: 'test description',
        title: 'test title',
        gistId: 'dummyID23',
        content: '<p>Hi there</p>',
        userId: user.id,
      });
      const response = await graphqlQuery(`
                              mutation {
                                deleteSnippet(snippetId: ${snippet.id}, archive: false, token: "jhjhhjjhjh") {
                                      status
                                      message
                                  }
                              }
                          `);
      const body = JSON.parse(response.text);
      expect(body).toHaveProperty('errors');
      expect(body.errors[0].message).toMatch(/jwt/);
    });
  });

  describe('Update snippet', () => {
    it('should fail if snippet does not exist', async () => {
      const user = await models.User.create({
        email: 'test@test.com',
        password: 'password',
      });
      const token = generateToken({ _uid: user.uid });
      const response = await graphqlQuery(`
                      mutation {
                        updateSnippet(snippetId: 33, token: "${token}", input: {
                            title: "test title",
                        }) {
                              id
                              title
                          }
                      }
                  `);
      const body = JSON.parse(response.text);
      expect(body).toHaveProperty('errors');
      expect(body.errors[0].message).toEqual(
        'Snippet with the specified ID was not found',
      );
    });

    it('should fail if user tries to delete another user snippet', async () => {
      const user = await models.User.create({
        email: 'test@test.com',
        password: 'password',
      });
      const snippet = await models.Snippet.create({
        description: 'test description',
        title: 'test title',
        gistId: 'dummyID23',
        content: '<p>Hi there</p>',
        userId: 33,
      });
      const token = generateToken({ _uid: user.uid });
      const response = await graphqlQuery(`
                        mutation {
                          updateSnippet(snippetId: ${snippet.id}, token: "${token}", input: {
                              title: "updated title",
                              content: "<p>Hi there, I am updated</p>"
                          }) {
                                title
                                id
                            }
                        }
                    `);
      const body = JSON.parse(response.text);
      expect(body).toHaveProperty('errors');
      expect(body.errors[0].message).toEqual(
        'You can only delete a snippet created by you',
      );
    });
    it('should update snippet', async () => {
      const user = await models.User.create({
        email: 'test@test.com',
        password: 'password',
      });
      const snippet = await models.Snippet.create({
        description: 'test description',
        title: 'test title',
        gistId: 'dummyID23',
        content: '<p>Hi there</p>',
        userId: user.id,
      });
      const token = generateToken({ _uid: user.uid });
      const response = await graphqlQuery(`
                          mutation {
                            updateSnippet(snippetId: ${snippet.id}, token: "${token}", input: {
                                title: "updated title",
                                content: "<p>Hi there, I am updated</p>"
                            }) {
                                  title
                                  id
                              }
                          }
                      `);
      const body = JSON.parse(response.text);
      expect(body).toHaveProperty('data');
      expect(body.data.updateSnippet.title).toEqual('updated title');
    });
  });
});
