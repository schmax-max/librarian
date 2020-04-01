const graphql = require("graphql");
const {
  GraphQLID,
  GraphQLList,
  GraphQLString,
  GraphQLInputObjectType,
  GraphQLObjectType
} = graphql;
const { Category, Allocation } = require("../../model");

const AreaType = new GraphQLObjectType({
  name: "AreaType",
  fields: () => ({
    _id: { type: GraphQLID },
    area_name: { type: GraphQLString },
    category_names: findCategories("category_names")
  })
});

function findCategories(key) {
  return {
    type: new GraphQLList(GraphQLString),
    async resolve({ area_name }) {
      const find = { parent_area: area_name };
      const res = await Category.find(find).populate(`${key}`);
      return res.map(k => k.category_name);
    }
  };
}

module.exports = AreaType;
