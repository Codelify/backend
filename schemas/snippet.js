const { gql } = require('apollo-server-express');

const snippetSchema = gql`
    extend type Query {
       getAllSnippets: [Snippet!]!
       getSnippetsByUserId(userId: Int!): [Snippet!]!
       getAuthUserSnippets(token: String!): [Snippet!]!
       getSnippetDetails(snippetId: String!): Snippet!
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
        createdAt: DateTime!
        owner: User!
        isFav: Boolean
        archivedAt: DateTime
        isPublic: Boolean
        shareId: String
    }

    extend type Mutation {
        createSnippet(input: SnippetInput!, token: String!): Snippet!
        deleteSnippet(snippetId: Int!, token: String!, archive: Boolean): SuccessResponse
        updateSnippet(snippetId: Int!, input: SnippetInput!, token: String!): Snippet
    }

    input SnippetInput {
        title: String
        description: String
        content: String
        tags: [String!]
        sourceUrl: String
        lang: String
        isFav: Boolean
        archivedAt: DateTime
    }

    type SuccessResponse {
        message: String!
        status: String!
    }

`;

module.exports = snippetSchema;
