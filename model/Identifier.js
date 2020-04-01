"use strict";
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const schema = new mongoose.Schema({
  _id: {
    type: "ObjectId"
  },
  identifier_name: {
    type: "string"
  },
  unidecode: {
    type: "string"
  },
  identifier_type: {
    type: "string"
  },
  identifier_segment: {
    type: "string"
  },
  parent_allocation: {
    type: "string"
  },
  parent_allocation_id: {
    type: "ObjectId"
  },
  boolean: {
    type: "object"
  }
});

schema.set("toJSON", { virtuals: true });

module.exports = createModels();

function createModels() {
  const models = {};
  const collections = ["all", "multi", "single", "url"];
  collections.forEach(k => {
    models[k] = mongoose.model(`identifier_${k}`, schema, `identifier_${k}`);
  });
  return models;
}
