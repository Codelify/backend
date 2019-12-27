const { gql } = require('apollo-server-express');

const snippetSchema = gql`
    extend type Query {
       getAllSnippets: [Snippet!]!
       getUserSnippets(userId: String!): [Snippet!]!
       getSnippetDetails(snippetId: String!): Snippet!
    }

    type Snippet {
        id: String!
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
