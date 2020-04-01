const Promise = require('bluebird')
const _ = require('lodash')

module.exports = {
    getAllocation,
    getLatestAllocation,
}

function getAllocation (allocationName, allocationType, fetchSettings) {
    // console.log({allocationName})
    // console.log({fetchSettings})
    if (fetchSettings === undefined) {
        fetchSettings = {
            potentialSetting: 'off',
            modelSetting: 'current',
            searchSetting: 'simple'
        }
    }
    if (allocationName === undefined) {
        allocationName = 'music'
    }
    if (allocationType === undefined) {
        allocationType = 'niche'
    }

    // console.log({allocationName})
    return getLatestAllocation (allocationName, allocationType)
    .then((existingAllocation) => {
        if (!existingAllocation) {
          return null
        } else {
          const {identifiers} = existingAllocation

          return getPotentialIdentifiers(allocationName, fetchSettings, identifiers, allocationType)
          .then((potentialIdentifiers) => {
              // console.log({potentialIdentifiers})
              // const potentialIdentifiersSimple = potentialIdentifiers[0]
              // const potentialIdentifiersAdvanced = potentialIdentifiers[1]

              const response = {
                  existingAllocation,
                  potentialIdentifiers,
              }
              return response
          })
        }


    })

}




function getLatestAllocation (allocationName, typeShort) {
    console.log('in getLatestAllocation')
    const {getRelevantModel} = require('../_helpers/helpers')
    const level = 'Allocation'
    const {relevantModel} = getRelevantModel (typeShort, level)
    let query = { allocation_name: allocationName }
    return relevantModel.findOne(query)
        .sort({ created_at: -1 })
        .then((latestAllocation) => {
            // console.log({latestAllocation})
            return latestAllocation
        })
        .catch((error) => {
            console.log({error})
            return null
        })
}

function getPotentialIdentifiers (allocationName, fetchSettings, identifiers, allocationType) {
    if (fetchSettings.potentialSetting === 'off') {
        return Promise.resolve()
    }
    if (!identifiers) {
        identifiers = {}
    }

    let identifierCategories = [
        'multi_capital',
        'single_capital',
        'single_acronym',
        'single_lower',
        'url_slugs',
        'url_identifier',
        'url_domain',
    ]

    const wordTypeCategories = {
        'multi_capital': 'word_analysis.multi_capital.frequent',
        'single_capital': 'word_analysis.single_capital.frequent',
        'single_acronym': 'word_analysis.single_acronym.frequent',
        'single_lower': 'word_analysis.single_lower.frequent',
        'url_slugs': 'url_parser.url_slugs',
        'url_identifier': 'url_parser.url_identifier',
        'url_domain': 'url_parser.url_domain',
    }
    const {modelSetting, searchSetting} = fetchSettings

    const {CoreArticleCurrent, CoreArticlePermanent} = require('../models/CoreArticle');
    let relevantModel = CoreArticleCurrent
    if (modelSetting === 'permanent') {
        relevantModel = CoreArticlePermanent
    }
    let promises = []
    if (searchSetting === 'advanced') {
        promises.push(createAdvancedMatchQuery (relevantModel, wordTypeCategories, identifiers))
    }

    return Promise.all(promises)
    .then((advancedMatchQuery) => {
        let filteredIdentifiersResult = {}
        return identifierCategories.reduce((promise, identifierCategory, index) => {
            return promise
            .then((result) => {

                const wordType = wordTypeCategories[identifierCategory]
                const simpleMatchQuery = { 'niches.location.allocation': allocationName }

                let matchQuery = simpleMatchQuery
                if (searchSetting === 'advanced') {
                    matchQuery = {
                        $or: [
                            simpleMatchQuery,
                            advancedMatchQuery[0]
                        ]
                    }
                }

                const {blocked_items} = identifiers
                const existingIdentifiersArray = identifiers[identifierCategory]
                const excludedIdentifiersArray = _.concat(blocked_items, existingIdentifiersArray)

                return getFilteredIdentifiersPerCategory(relevantModel, wordType, matchQuery, excludedIdentifiersArray, allocationType)

                .then((filteredIdentifiers) => {
                    filteredIdentifiersResult[identifierCategory] = filteredIdentifiers
                    return filteredIdentifiersResult
                })
            })
            .catch((err) => {
                console.log({err})
            })
        }, Promise.resolve())
    })
}

function getFilteredIdentifiersPerCategory (relevantModel, wordType, matchQuery, excludedIdentifiersArray, allocationType) {
    return createFrequentIdentifierQuery(relevantModel, wordType, matchQuery, excludedIdentifiersArray)
    .then((frequentIdentifiersCollection) => {
        const frequentIdentifiersArray = frequentIdentifiersCollection.map((k) => { return k._id }) || []
        return filterIdentifiers(frequentIdentifiersArray, allocationType)
        .then((filteredIdentifiers) => {
            filteredIdentifiers = filteredIdentifiers || []
            return filteredIdentifiers
        })
    })
}

function filterIdentifiers (frequentIdentifiers, allocationType) {
    let filteredIdentifiers = []
    return frequentIdentifiers.reduce((promise, identifier, index) => {
        return promise
        .then((result) => {
            const identifierIsYear = (identifier === identifier.toUpperCase() && identifier.length < 5)
            // const identifierIsExcluded = excludedIdentifiers.indexOf(identifier) > -1
            // if (identifierIsExcluded) {
            //     console.log(`${identifier} is excluded`)
            // }
            if (
                identifier === ''
                || identifierIsYear
                // || identifierIsExcluded
            ) {
                return filteredIdentifiers
            } else if (allocationType === 'trending') {
                filteredIdentifiers.push(identifier)
                return filteredIdentifiers
            } else {


                const {IdentifierUrl, IdentifierGeography, IdentifierOffgrid, IdentifierNiche} = require('../models/Identifier')
                let promises = []


                promises.push(IdentifierUrl.countDocuments({identifier_name: identifier}))
                promises.push(IdentifierGeography.countDocuments({identifier_name: identifier}))
                promises.push(IdentifierOffgrid.countDocuments({identifier_name: identifier}))
                promises.push(IdentifierNiche.countDocuments({identifier_name: identifier}))
                return Promise.all(promises)
                .then((results) => {
                    // console.log({results})
                    if (
                      results[0] === 0
                      && results[1] === 0
                      && results[2] === 0
                      && results[3] === 0
                    ) {
                        filteredIdentifiers.push(identifier)
                        return filteredIdentifiers
                    } else {
                        return filteredIdentifiers
                    }

                })
            }


        })

    }, Promise.resolve())
}


function createFrequentIdentifierQuery (relevantModel, wordType, matchQuery, excludedIdentifiersArray) {
    return relevantModel.aggregate([
        { $match: matchQuery },
        { $project:
            {
                'url': 1,
                'keyWords': `$${wordType}`,
            }
        },
        { $unwind: '$keyWords' },
        { $group:
            {
                '_id': '$keyWords',
                'count':  { $sum : 1},
            }
        },
        { $match: {
            'count': { $gt : 1},
            '_id': { $nin: excludedIdentifiersArray }
        } },
        { $sort: { count: -1 } },
        { $limit: 100 },
    ])
}

function createAdvancedMatchQuery (relevantModel, wordTypeCategories, identifiers) {
    if (!identifiers) {
        identifiers = {}
    }

    return relevantModel.aggregate([
        { $project:
            {
                'url': 1,
                'item0': `$${wordTypeCategories['multi_capital']}`,
                'item1': `$${wordTypeCategories['single_capital']}`,
                'item2': `$${wordTypeCategories['single_acronym']}`,
                'item3': `$${wordTypeCategories['single_lower']}`,
                'item4': `$${wordTypeCategories['url_slugs']}`,
                'item5': `$${wordTypeCategories['url_identifier']}`,
                'item6': `$${wordTypeCategories['url_domain']}`,
            }
        },
        { $unwind: { path: '$item0', preserveNullAndEmptyArrays: true }  },
        { $unwind: { path: '$item1', preserveNullAndEmptyArrays: true }  },
        { $unwind: { path: '$item2', preserveNullAndEmptyArrays: true }  },
        { $unwind: { path: '$item3', preserveNullAndEmptyArrays: true }  },
        { $unwind: { path: '$item4', preserveNullAndEmptyArrays: true }  },
        { $unwind: { path: '$item5', preserveNullAndEmptyArrays: true }  },
        { $unwind: { path: '$item6', preserveNullAndEmptyArrays: true }  },
        { $match:
            {$or: [
                { 'item0': { '$in': identifiers['multi_capital'] || [] } },
                { 'item1': { '$in': identifiers['single_capital'] || []  } },
                { 'item2': { '$in': identifiers['single_acronym'] || []  } },
                { 'item3': { '$in': identifiers['single_lower'] || []  } },
                { 'item4': { '$in': identifiers['url_slugs'] || []  } },
                { 'item5': { '$in': identifiers['url_identifier'] || []  } },
                { 'item6': { '$in': identifiers['url_domain'] || []  } },
            ]}
        },
        { $group:
            {
                '_id': '$url',
                'count':  { $sum : 1},
            }
        },
        { $match: { 'count': { $gt : 0} } },
    ])
    .then((urlMatchCollection) => {
        const urlMatchArray = urlMatchCollection.map((k) => { return k._id })
        const {length} = urlMatchArray
        // console.log({length})
        const advancedMatchQuery = { 'url': { $in: urlMatchArray } }
        return advancedMatchQuery
    })
}
