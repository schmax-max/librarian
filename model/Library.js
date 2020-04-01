"use strict";
const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  _type: {
    type: "string"
  },
  _id: {
    type: "ObjectId"
  },
  content_url: {
    type: "string"
  },
  updated_at: {
    type: "date",
    format: "date-time"
  },
  body: {
    type: "object"
  },
  allocations: {
    type: "object"
  },
  locations: {
    type: "object"
  }
});

schema.set("toJSON", { virtuals: true });

module.exports = {
  articles: mongoose.model(`library_articles`, schema),
  videos: mongoose.model(`library_videos`, schema),
  photos: mongoose.model(`library_photos`, schema),
  podcasts: mongoose.model(`library_podcasts`, schema)
};
