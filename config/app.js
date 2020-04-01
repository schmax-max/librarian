const express = require("express");
const expressGraphQL = require("express-graphql");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const { errorHandler, router } = require("./appHelpers");
const schema = require("../gql");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());
app.use(errorHandler);
app.use(router);
app.use(
  "/graphql",
  expressGraphQL({
    schema,
    graphiql: true
  })
);

module.exports = app;
