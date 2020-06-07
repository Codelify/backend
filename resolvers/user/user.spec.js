const { sequelize } = require('../../database/models');
const { graphqlQuery } = require('../../helpers/tests');
const { generateToken } = require('../../helpers/jwt');
const models = require('../../database/models');

beforeEach(async () => {
  await sequelize.truncate();
});

describe('User Resolver', () => {
  describe('User Registration', () => {
    it('should fail if email is not valid', async () => {
      const res = await graphqlQuery(`
        mutation {
            register(input: {
                email: "test",
                password: "password"
            }) {
                token
                email
            }
        }
     `);
      const body = JSON.parse(res.text);
      expect(body).toHaveProperty('errors');
      expect(body.errors[0].message).toEqual('Invalid email specified');
    });
    it('should fail if password length is less than 6', async () => {
      const res = await graphqlQuery(`
          mutation {
              register(input: {
                  email: "test@test.com",
                  password: "pas"
              }) {
                  token
                  email
              }
          }
       `);
      const body = JSON.parse(res.text);
      expect(body).toHaveProperty('errors');
      expect(body.errors[0].message).toEqual(
        'The password length must be at least 6 characters',
      );
    });

    it('should register a user', async () => {
      const res = await graphqlQuery(`
            mutation {
                register(input: {
                    email: "test@test.com",
                    password: "password"
                }) {
                    token
                    email
                }
            }
         `);
      const body = JSON.parse(res.text);
      expect(res.status).toEqual(200);
      expect(body).toHaveProperty('data');
      expect(body).toHaveProperty('data.register');
      expect(body.data.register).toHaveProperty('token');
    });

    it('should fail if user already exist', async () => {
      await models.User.create({
        email: 'test@test.com',
        password: 'password',
      });
      const res = await graphqlQuery(`
              mutation {
                  register(input: {
                      email: "test@test.com",
                      password: "password"
                  }) {
                      token
                      email
                  }
              }
           `);
      const body = JSON.parse(res.text);
      expect(body).toHaveProperty('errors');
      expect(body.errors[0].message).toEqual(
        'An account with the specified email already exists',
      );
    });
  });

  describe('User Login', () => {
    it('should fail if credential is incorrect', async () => {
      await models.User.create({
        email: 'test@example.com',
        password: 'password',
      });
      const res = await graphqlQuery(`
        mutation {
            login(input: {
                email: "test@example.com",
                password: "wrong-password"
            }) {
                token
                email
            }
        }
     `);
      const body = JSON.parse(res.text);
      expect(body).toHaveProperty('errors');
      expect(body.errors[0].message).toEqual('Invalid credential provided');
    });

    it('should login user', async () => {
      await models.User.create({
        email: 'test@example.com',
        password: 'password',
      });
      const res = await graphqlQuery(`
      mutation {
          login(input: {
              email: "test@example.com",
              password: "password"
          }) {
              token
              email
          }
      }
   `);
      const body = JSON.parse(res.text);
      expect(res.status).toEqual(200);
      expect(body).toHaveProperty('data');
      expect(body).toHaveProperty('data.login');
      expect(body.data.login).toHaveProperty('token');
    });
  });

  describe('Google Authentication', () => {
    it('should login user if account already exists', async () => {
      await models.User.create({
        email: 'test@example.com',
        password: 'password',
      });
      const res = await graphqlQuery(`
          mutation {
            authWithGoogle(input: {
                  email: "test@example.com",
                  password: "password"
              }) {
                  token
                  email
              }
          }
       `);
      const body = JSON.parse(res.text);
      expect(res.status).toEqual(200);
      expect(body).toHaveProperty('data');
      expect(body).toHaveProperty('data.authWithGoogle');
      expect(body.data.authWithGoogle).toHaveProperty('token');
    });
    it('should create new user and authenticate if not already exists', async () => {
      const res = await graphqlQuery(`
            mutation {
              authWithGoogle(input: {
                    email: "test@example.com",
                    password: "password",
                    gitAccessToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9",
                }) {
                    token
                    email
                }
            }
         `);
      const body = JSON.parse(res.text);
      expect(res.status).toEqual(200);
      expect(body).toHaveProperty('data');
      expect(body).toHaveProperty('data.authWithGoogle');
      expect(body.data.authWithGoogle).toHaveProperty('token');
    });
  });

  describe('Update user profile', () => {
    it('should fail if token is invalid', async () => {
      const res = await graphqlQuery(`
              mutation {
                updateProfile(input: {
                      firstName: "test",
                      lastName: "test"
                  }, token: "hjhjhshjahj") {
                     firstName
                     lastName
                  }
              }
           `);
      const body = JSON.parse(res.text);
      expect(body).toHaveProperty('errors');
      expect(body.errors[0].message).toMatch(/jwt/);
    });
    it('should should update user profile', async () => {
      const user = await models.User.create({
        email: 'test@example.com',
        password: 'password',
      });
      const token = generateToken({ _uid: user.uid });

      const res = await graphqlQuery(`
            mutation {
              updateProfile(input: {
                    firstName: "test",
                    lastName: "test"
                }, token: "${token}") {
                   firstName
                   lastName
                }
            }
         `);
      const body = JSON.parse(res.text);
      expect(res.status).toEqual(200);
      expect(body).toHaveProperty('data');
      expect(body).toHaveProperty('data.updateProfile');
      expect(body.data.updateProfile.lastName).toEqual('test');
    });
  });

  describe('Get user details', () => {
    it('should return the user details', async () => {
      const user = await models.User.create({
        email: 'test@example.com',
        firstName: 'test',
        lastName: 'test',
        password: 'password',
      });

      await models.Snippet.create({
        title: 'dummy title',
        userId: user.id,
      });
      const token = generateToken({ _uid: user.uid });
      const res = await graphqlQuery(`
            query {
              getUserDetails(token: "${token}") {
                   firstName
                   lastName
                   snippets {
                       title
                   }
                }
            }
         `);
      const body = JSON.parse(res.text);
      expect(res.status).toEqual(200);
      expect(body).toHaveProperty('data');
      expect(body).toHaveProperty('data.getUserDetails');
      expect(body.data.getUserDetails.lastName).toEqual('test');
      expect(body.data.getUserDetails).toHaveProperty('snippets');
      expect(body.data.getUserDetails.snippets[0].title).toEqual('dummy title');
    });
  });
});
