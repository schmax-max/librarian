require("./config/connection");

const {
  changeAllocations,
  changeIdentifiers,
  createIdentifiers
} = require("./adhoc");
changeIdentifiers();
// changeAllocations()
// createIdentifiers ()

const { commander } = require("./svc/commander");
const { body } = require("./tests/data");
// commander(body).then(res => {
//   console.log({ res });
// });
