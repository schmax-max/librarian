const Joi = require("@hapi/joi");
exports.body = Joi.object({
  core: Joi.object().required(),
  scores: Joi.object().required(),
  frequent_words: Joi.array().required(),
  search_words: Joi.array().required(),
  word_arrays: Joi.object().required(),
  url_info: Joi.object().required()
});

exports.bodyServer = Joi.object({});
