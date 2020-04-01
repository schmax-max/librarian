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

const Mutation = new GraphQLObjectType({
  name: "Mutation",
  fields: () => ({
    mutateCategoryName: {
      type: CategoryType,
      args: {
        old_category_name: { type: new GraphQLNonNull(GraphQLString) },
        new_category_name: { type: new GraphQLNonNull(GraphQLString) }
      },
      resolve(parentValue, args) {
        updateCategoryFunction(Allocation, "parent_category", args);
        return updateCategoryFunction(Category, "category_name", args);
      }
    },
    mutateAllocation: {
      type: AllocationType,
      args: {
        old_allocation_name: { type: new GraphQLNonNull(GraphQLString) },
        new_allocation_name: { type: new GraphQLNonNull(GraphQLString) },
        parent_category: { type: new GraphQLNonNull(GraphQLString) }
      },
      async resolve(
        parentValue,
        { old_allocation_name, new_allocation_name, parent_category }
      ) {
        const options = { upsert: false, new: true };

        if (old_allocation_name !== new_allocation_name) {
          for (const key in Identifier) {
            await Identifier[key].updateMany(
              { parent_allocation: old_allocation_name },
              {
                $set: { parent_allocation: new_allocation_name }
              },
              options
            );
          }
        }

        await Allocation.findOneAndUpdate(
          { allocation_name: old_allocation_name },
          {
            $set: { allocation_name: new_allocation_name, parent_category }
          },
          options
        );
      }
    },
    createCategory: {
      type: CategoryType,
      args: {
        category_name: { type: new GraphQLNonNull(GraphQLString) },
        parent_area: { type: new GraphQLNonNull(GraphQLString) }
      },
      resolve(parentValue, { category_name, parent_area }) {
        const category = { category_name, parent_area };
        const options = { upsert: true, new: true };
        return Category.findOneAndUpdate(category, category, options);
      }
    },
    createAllocation: processAllocation("create"),
    deleteAllocation: processAllocation("delete"),
    createIdentifier: processIdentifier("create"),
    deleteIdentifier: processIdentifier("delete")
  })
});

function processAllocation(action) {
  // console.log("in processAllcoation");
  const keys = ["allocation_name", "parent_category"];
  return processItem(action, AllocationType, keys);
}

function processIdentifier(action) {
  console.log("in processIdentifier");
  const keys = ["identifier_name", "identifier_type", "parent_allocation"];
  return processItem(action, IdentifierType, keys);
}

function processItem(action, type, keys) {
  // console.log("in processItem");
  const args = {};
  keys.forEach(key => {
    // console.log({ key });
    args[key] = { type: new GraphQLNonNull(GraphQLString) };
  });
  return {
    type,
    args,
    resolve(parentValue, args) {
      const find = {};
      // console.log({ args });
      let model;
      keys.forEach(key => {
        if (key === "parent_category" && args[key] === "orphaned") {
          // find[key] = args[key];
        } else if (key === "identifier_type") {
          const identifier_type = args[key];
          model = Identifier[identifier_type];
        } else {
          find[key] = args[key];
          if (key === "allocation_name") {
            model = Allocation;
          }
        }
      });
      // console.log({ find });
      if (action === "create") {
        // console.log(`goes to create`);
        const update = {};
        update["$set"] = find;
        const options = { upsert: true, new: true };
        return model.findOneAndUpdate(find, update, options);
      } else if (action === "delete") {
        // console.log(`goes to delete`);
        return model.deleteOne(find);
      }
    }
  };
}

async function updateCategoryFunction(
  model,
  key,
  { old_category_name, new_category_name }
) {
  const find = {};
  find[key] = old_category_name;
  const updateSet = {};
  updateSet[key] = new_category_name;
  const update = {};
  update["$set"] = updateSet;
  const options = { upsert: false, new: true };
  return await model.updateMany(find, update, options);
}

module.exports = Mutation;
