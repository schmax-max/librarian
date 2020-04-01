const unidecode = require("unidecode");
const { Identifier, Allocation } = require("../model");

module.exports = changeIdentifiers;

async function changeIdentifiers() {
  // const find = { identifier_name: /Franc*/ };
  const identifiers = await Identifier["multi"].find();
  let iterations = identifiers.length;
  // iterations = 1
  for (let i = 0; i < iterations; i++) {
    const identifier = identifiers[i];

    // identifier.identifier_name = unidecode(identifier.identifier_name);
    identifier.parent_allocation_id = undefined;
    identifier.save((err, update) => {
      if (err) {
        console.log({ err });
      } else {
        console.log(`${i} of ${iterations}`);
        return;
      }
    });
  }

  console.log("===========");
}
