const graphql = require("graphql");
const {
  GraphQLID,
  GraphQLList,
  GraphQLString,
  GraphQLInputObjectType,
  GraphQLObjectType
} = graphql;
const { Allocation } = require("../../model");

const StructureType = new GraphQLObjectType({
  name: "StructureType",
  fields: () => ({
    _id: { type: GraphQLID },
    category_name: { type: GraphQLString },
    parent_area: { type: GraphQLString },
    parent_area_id: { type: GraphQLID },
    allocation_names: findAllocations(),
    other_allocation_names: findAllocations("other")
  })
});

function findAllocations() {
  const key = "allocation_names";
  return {
    type: new GraphQLList(GraphQLString),
    resolve({ category_name }, args) {
      const find = { parent_category: category_name };
      return Allocation.find(find)
        .populate(`${key}`)
        .then(res => res.map(k => k.allocation_name));
    }
  };
}

// structure: { type: GraphQLInputObjectType }

module.exports = StructureType;
