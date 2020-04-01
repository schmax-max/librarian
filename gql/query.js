const {
  GraphQLObjectType,
  GraphQLList,
  GraphQLString,
  GraphQLID,
  GraphQLNonNull
} = require("graphql");
const { Allocation, Area, Category, Identifier } = require("../model");
const {
  AllocationType,
  AreaType,
  CategoryType,
  IdentifierType
} = require("./types");

const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: () => ({
    allAreas: {
      type: new GraphQLList(AreaType),
      resolve() {
        return Area.find({});
      }
    },
    orphanedPerArea: orphanedPerArea(),
    // {
    //   type: AreaType,
    //   args: { area_name: { type: new GraphQLNonNull(GraphQLString) } },
    //   async resolve(parentValue, { area_name }) {
    //     console.log({ area_name });
    //     const area = await Area.findOne({ area_name });
    //     console.log({ area });
    //     return area;
    //   }
    // },
    categoriesPerArea: createQuery(CategoryType, Category, "parent_area"),
    allocationsPerCategory: createQuery(
      AllocationType,
      Allocation,
      "parent_category"
    ),
    allocationInfo: createSingleQuery(
      AllocationType,
      Allocation,
      "allocation_name"
    )
  })
});

function orphanedPerArea(key) {
  return {
    type: new GraphQLList(AllocationType),
    args: { area_name: { type: new GraphQLNonNull(GraphQLString) } },
    async resolve(parentValue, { area_name }) {
      const categories = await Category.find({ parent_area: area_name });
      const category_names = categories.map(k => k.category_name);
      const find = { parent_category: { $nin: category_names } };
      const allocations = await Allocation.find(find);
      return allocations;
    }
  };
}

function createSingleQuery(type, model, key) {
  console.log(`createSingleQuery for ${key}`);
  const args = {};
  args[key] = { type: new GraphQLNonNull(GraphQLString) };
  return {
    type,
    args,
    resolve(parentValue, args) {
      const find = {};
      find[key] = args[key];
      return model.findOne(find);
    }
  };
}

function createQuery(type, model, key, isFindOne) {
  console.log(`createQuery for ${key}`);
  const args = {};
  args[key] = { type: new GraphQLNonNull(GraphQLString) };
  return {
    type: new GraphQLList(type),
    args,
    resolve(parentValue, args) {
      const find = {};
      find[key] = args[key];
      return model.find(find);
    }
  };
}

function createPerQueryArray(model, keyQuery, keyResult) {
  console.log("in createPerQueryArray");
  const args = {};
  args[keyQuery] = { type: new GraphQLNonNull(GraphQLString) };
  const object = {
    type: new GraphQLList(CategoryType),
    args,
    resolve(parentValue, args) {
      const find = {};
      find[keyQuery] = args[keyQuery];
      return model.find(find).then(res => {
        res = res.map(k => k[keyResult]);
        return res;
      });
    }
  };
  return object;
}

module.exports = RootQuery;
