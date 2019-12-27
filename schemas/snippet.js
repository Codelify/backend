const { gql } = require('apollo-server-express');

const snippetSchema = gql`
    extend type Query {
       getAllSnippets: [Snippet!]!
       getSnippetsByUserId(userId: Int!): [Snippet!]!
       getAuthUserSnippets: [Snippet!]!
       getSnippetDetails(snippetId: Int!): Snippet!
    }

    type Snippet {
        id: Int!
        uid: String!
        title: String
        description: String
        content: String
        tags: [String!]
        sourceUrl: String
        lang: String
    }

    extend type Mutation {
        createSnippet(input: SnippetInput!): Snippet!
    }

    input SnippetInput {
        title: String
        description: String
        content: String
        tags: [String!]
        sourceUrl: String
        lang: String
    }

`;

module.exports = snippetSchema;
