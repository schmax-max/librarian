const _ = require ('lodash')
module.exports = {frequencyPerType}
const {inputValues} = require ('./inputValues')

function frequencyPerType (input, identifiers, frequencyType, frequencyObject) {
  
  const {basic, core, url, identifierArray} = getFrequencyArrays (input, identifiers, frequencyType)
  // console.log ()
  let baseArray = basic || core
  if (frequencyType === 'url_slugs') {
    baseArray = url
  } else if (frequencyType.includes('url')) {
    baseArray = [url]
  }

  
  if (!Array.isArray(baseArray)) {
    console.log(`warning baseArray is not array for type ${frequencyType}`)  
    console.log({baseArray})
  }

  baseArray.reduce((newObject, baseItem) => {
      if (
          identifierArray.indexOf(baseItem) > -1
          && newObject.tags.core.indexOf(baseItem) === -1
          && newObject.tags.basic.indexOf(baseItem) === -1
          && newObject.tags.url.indexOf(baseItem) === -1
      ) {
        const matchType = getMatchType (baseItem, core, basic, url)
        const points = inputValues.points_per_tag[frequencyType][matchType]
        newObject.counts[matchType][frequencyType] += 1
        newObject.points[matchType][frequencyType] += points
        newObject.tags[matchType].push(baseItem)
        newObject.tagCounts[matchType] += 1
        newObject.totalCounts += 1
        newObject.totalPoints += points
      }
      return newObject
  }, frequencyObject)
}

function getMatchType (baseItem, core, basic, url) {
  let matchType
  if (core && core.indexOf(baseItem) > -1) {
    matchType = 'core'
  } else if (url && url.indexOf(baseItem) > -1) {
    matchType = 'url'
  } else if (basic && basic.indexOf(baseItem) > -1) {
    matchType = 'basic'
  } 
  return matchType
}

function getFrequencyArrays ({word_arrays, url_info}, identifiers, type) {
  const input = {}
  input.identifierArray = getIdentifierArray(type, identifiers)
  if (type.includes('url')) {
      input.url = url_info[type]
  } else {
      input.core = word_arrays[type].frequent || []
      input.basic = word_arrays[type].all || []
  } 
  return input
}

function getIdentifierArray (type, identifiers) {
  let identifierArray
  if (type === 'single_title') {
    identifierArray = _.concat(
        identifiers.single_lower,
        identifiers.single_capital,
        identifiers.single_acronym
    )
  } else if (type === 'multi_title') {
    identifierArray = identifiers['multi_capital']
  } else {
    identifierArray = identifiers[type]
  }
  return identifierArray || []
}


