const { gateway } = require("./gateway");
const { commander } = require("./commander");
const { server } = require("./server");

module.exports = { master };

async function master(req) {
  if (gateway(req)) {
    if (req.params.trigger === "server") {
      return await server(req.body);
    } else {
      return await commander(req.body);
    }
  } else {
    consolelog({ body: req.body });
    console.log("request to librarian not validated");
    return;
  }
}
