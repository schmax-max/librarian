const {Structure} = require('../model')

module.exports = {server}

async function server (trigger) {
  const structure = await Structure.niches.findOne()
  return structure
}