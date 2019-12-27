const { gql } = require('apollo-server-express');

const snippetSchema = gql`
    type Query {
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

    type Mutation {
        createSnippet(input: SnippetInput!): Snippet!
    }

`;

module.exports = snippetSchema;
