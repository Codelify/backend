const { gql } = require('apollo-server-express');

const userSchema = gql`
    extend type Query {
        getAllUsers: [User!]!
        getUserById(userId: String!): User!
        getUserDetails: User!
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
        id: Int!
        uid: String!
        email: String!
        firstName: String
        lastName: String
        avatar: String
        token: String!
    }
`;

module.exports = userSchema;
