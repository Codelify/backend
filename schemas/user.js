const { gql } = require('apollo-server-express');

const userSchema = gql`
    extend type Query {
        getAllUsers: [User!]!
        getUserById(userId: String!): User!
    }
    type User {
        id: String!
        uid: String!
        email: String!
        firstName: String
        lastName: String
        avatar: String
        password: String
        snippets: [Snippet!]!
    }

    extend type Mutation {
        register(input: RegisterInput!): RegisterResponse!
        login(input: LoginInput!): RegisterResponse!
    }

    input RegisterInput {
        email: String!
        firstName: String
        lastName: String
        avatar: String
        password: String
    }

    input LoginInput {
        email: String!
        password: String!
    }

    type RegisterResponse {
        id: String!
        uid: String!
        email: String!
        firstName: String
        lastName: String
        avatar: String
        token: String!
    }
`;

module.exports = userSchema;
