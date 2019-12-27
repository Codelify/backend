const { gql } = require('apollo-server-express');
const userTypes = require('./user.js');
const snippetTypes = require('./snippet.js');


const rootType = gql`
 type Query {
     root: String
 }
 type Mutation {
     root: String
 }
`;

module.exports = [rootType, userTypes, snippetTypes];