const { gql } = require('apollo-server-express');

const userSchema = gql`
    extend type Query {
        getAllUsers: [User!]!
        getUserById(userId: String!): User!
        getUserDetails(token: String!): User!
    }
    input ProfileInput {
        firstName: String
        lastName: String
        avatar: String
        twitter: String
        linkedin: String
        github: String
        bio: String
        enableNewsletter: Boolean
    }
    type User {
        id: Int!
        uid: String!
        email: String!
        firstName: String
        lastName: String
        avatar: String
        password: String
        createdAt: DateTime
        snippets: [Snippet!]
        twitter: String
        linkedin: String
        bio: String
        enableNewsletter: Boolean
        github: String
        gitAccessToken: String
        gitUsername: String
    }

    extend type Mutation {
        register(input: RegisterInput!): RegisterResponse!
        login(input: LoginInput!): RegisterResponse!
        authWithGoogle(input: RegisterInput!): RegisterResponse!
        updateProfile(token: String!, input: ProfileInput!): User!
    }

    input RegisterInput {
        email: String!
        firstName: String
        lastName: String
        avatar: String
        password: String!
        twitter: String
        linkedin: String
        github: String
        bio: String
        gitUsername: String
        gitAccessToken: String
    }

    input LoginInput {
        email: String!
        password: String!
    }

    type RegisterResponse {
        id: Int!
        uid: String!
        email: String!
        firstName: String
        lastName: String
        avatar: String
        token: String!
        twitter: String
        linkedin: String
        github: String
        bio: String
        gitUsername: String
        gitAccessToken: String
    }
`;

module.exports = userSchema;
