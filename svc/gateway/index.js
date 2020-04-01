const Joi = require('@hapi/joi');
const {body, bodyServer} = require('./body')
const {params} = require('./params')
const {validate} = require('./validate')

module.exports = {gateway}

function gateway (input, type) {
  if (type === 'body') {
    return validate(input, body)
  } if (type === 'params') {
    return validate(input, params)
  } if (type === 'server') {
    return validate(input, bodyServer)
  } else {
    if (validate(input.params, params)) {
      if (input.params.trigger === 'server') {
        return validate(input.body, bodyServer)
      } else {
        return validate(input.body, body)
      }
    } else {
      return false
    }
  }
}


