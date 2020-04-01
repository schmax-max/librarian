const graphql = require("graphql");
const {
  GraphQLObjectType,
  GraphQLList,
  GraphQLID,
  // GraphQLInt,
  GraphQLInputObjectType,
  GraphQLString,
  GraphQLBoolean
} = graphql;
const { Identifier } = require("../../model");

const AllocationType = new GraphQLObjectType({
  name: "AllocationType",
  fields: () => ({
    _id: { type: GraphQLID },
    allocation_name: { type: GraphQLString },
    parent_category: { type: GraphQLString },
    multi: findIdentifiers("multi"),
    single: findIdentifiers("single"),
    url: findIdentifiers("url")
  })
});

function findIdentifiers(key) {
  return {
    type: new GraphQLList(GraphQLString),
    resolve({ allocation_name }, args) {
      const find = {
        parent_allocation: allocation_name
      };
      return Identifier[key]
        .find(find)
        .populate(`${key}`)
        .then(res => res.map(k => k.identifier_name));
    }
  };
}

module.exports = AllocationType;
