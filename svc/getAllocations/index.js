const _ = require('lodash')
const {Identifier} = require('../../model')
const {allocationCalcsInitial} = require('./allocationCalcsInitial')
const {allocationCalcsFinal} = require('./allocationCalcsFinal')

// console.log({Identifiers})
module.exports = {getAllocations}

async function getAllocations (body) {
  console.log('in getAllocations')

  // console.log({word_arrays, url_info})
  // const singleArray = 

  // const frequentArray = _.concat 
  const arrays = getOtherArrays (body.word_arrays, body.url_info)
  arrays.url = getUrlArray(body.url_info)
  const identifiers = await findIdentifiers (arrays)  

  const allocations = organiseAllocations (identifiers)
  const initialResponse = allocationCalcsInitial (body, allocations)
  const finalResponse = allocationCalcsFinal (initialResponse)
  return finalResponse
}

function organiseAllocations (identifiers) {
  const allocations = {}
  Object.keys(identifiers).forEach((identifier_type) => {
    const identifiersArray = identifiers[identifier_type]
    identifiersArray.forEach((identifier) => {
      const {parent_allocation, identifier_name} = identifier
      
      if (!allocations[parent_allocation]) {
        allocations[parent_allocation] = {}
      }
  
      if (!allocations[parent_allocation][identifier_type]) {
        allocations[parent_allocation][identifier_type] = []
      }
  
      allocations[parent_allocation][identifier_type].push(identifier_name)
    })
  })
  return allocations
}




function getUrlArray ({url_slugs, url_domain, url_identifier}) {
  const urlArray = _.concat(
    [url_domain],
    [url_identifier]
  )
  return urlArray
}

function getOtherArrays (word_arrays, {url_slugs}) {
  const arrays = {
    single: url_slugs,
    multi: []
  }
  
  Object.keys(word_arrays).forEach((key) => {
    
    const {all, frequent} = word_arrays[key]
    const newArray = all || frequent
    const shortKey = key.split('_')[0]
    arrays[shortKey] = _.concat(arrays[shortKey], newArray)
  })
  return arrays
}

async function findIdentifiers (arrays) { 
  const identifiers = {}
  for (key in arrays) {
    // const array = arrays[key]
    identifiers[key] = await Identifier[key].find({
      'parent_allocation': { $exists: true },
      'identifier_name': { $in: arrays[key] }
    })
  }
  return identifiers
}