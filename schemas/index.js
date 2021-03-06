const { gql } = require('apollo-server-express');
const userTypes = require('./user');
const snippetTypes = require('./snippet');

const rootType = gql`
 type Query {
     root: String
 }
 type Mutation {
     root: String
 }

 scalar DateTime
`;

module.exports = [rootType, userTypes, snippetTypes];
