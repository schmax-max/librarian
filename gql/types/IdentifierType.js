const graphql = require("graphql");
const {
  GraphQLObjectType,
  // GraphQLList,
  GraphQLID,
  // GraphQLInt,
  GraphQLInputObjectType,
  GraphQLString,
  GraphQLBoolean
} = graphql;

const IdentifierType = new GraphQLObjectType({
  name: "IdentifierType",
  fields: () => ({
    _id: { type: GraphQLID },
    identifier_name: { type: GraphQLString },
    identifier_type: { type: GraphQLString },
    identifier_segment: { type: GraphQLString },
    parent_allocation: { type: GraphQLString },
    parent_allocation_id: { type: GraphQLID }
  })
});

module.exports = IdentifierType;
