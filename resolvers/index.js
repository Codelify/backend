const { GraphQLScalarType } = require('graphql/type');
const { Kind } = require('graphql/language');
const userResolver = require('../resolvers/user');
const snippetResolver = require('../resolvers/snippet');

const dateResolver = {
  DateTime: new GraphQLScalarType({
    name: 'DateTime',
    description: 'Date custom scalar type',
    parseValue(value) {
      return new Date(value); // value from the client
    },
    serialize(value) {
      return new Date(value); // value sent to the client
    },
    parseLiteral(ast) {
      if (ast.kind === Kind.INT) {
        return parseInt(ast.value, 10); // ast value is always in string format
      }
      return null;
    },
  }),
};

module.exports = [dateResolver, userResolver, snippetResolver];
