module.exports = {calcsPerAllocation}
const {frequencyPerType} = require('./frequencyPerType')

function calcsPerAllocation (input, {identifiers}) {
  const frequencyTypes = [
      'url_identifier',
      'url_domain',
      'url_slugs',
      'multi_title',
      'single_title',
      'multi_capital',
      'single_capital',
      'single_acronym',
      'single_lower',
  ]
  const frequencyObject = {
    totalCounts: 0,
    totalPoints: 0,
    counts: {
        url: {
            url_slugs: 0,
            identifier_url: 0,
            host_url: 0,
        },
        basic: {
            single_lower: 0,
            single_capital: 0,
            single_acronym: 0,
            single_title: 0,
            multi_capital: 0,
        },
        core: {
            single_lower: 0,
            single_capital: 0,
            single_acronym: 0,
            single_title: 0,
            multi_capital: 0,
        },
    },
    points: {
        url: {
            url_slugs: 0,
            identifier_url: 0,
            host_url: 0,
        },
        basic: {
            single_lower: 0,
            single_capital: 0,
            single_acronym: 0,
            single_title: 0,
            multi_capital: 0,
            multi_title: 0,
        },
        core: {
            single_lower: 0,
            single_capital: 0,
            single_acronym: 0,
            single_title: 0,
            multi_capital: 0,
            multi_title: 0,
        },
    },
    tags: {
        basic: [],
        core: [],
        url: [],
    },
    tagCounts: {
      basic: 0,
      core: 0,
      url: 0,
    }  
  }
  
  frequencyTypes.forEach((frequencyType) => {
      frequencyPerType (input, identifiers, frequencyType, frequencyObject)
  })
  return frequencyObject
}


