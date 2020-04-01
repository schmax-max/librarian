'use strict'
const Promise = require('bluebird')
const mongoose = require ('mongoose')
const moment = require ('moment-timezone')

module.exports = {
    changeManyIdentifiers,
    findUnprocessedIdentifiers,
}

function changeManyIdentifiers (allocationName, typeShort, identifiersObject, option) {
    console.log('in changeManyIdentifiers')
    return Object.keys(identifiersObject).forEach((identifierCategory) => {
        const identifiersArray = identifiersObject[identifierCategory]
        return identifiersArray.reduce((promise, identifierName) => {
            return promise
            .then(() => {
                if (option === 'create') {
                    if (identifierCategory === 'blocked_identifiers') {
                        typeShort = 'unprocessed'
                    }
                    return createIdentifier(allocationName, typeShort, identifierName, identifierCategory)
                }
                else if (option === 'move') {
                    return moveIdentifier(allocationName, typeShort, identifierName)
                } else {
                    console.log('triggering basic resolve')
                    return Promise.resolve()
                }
            })
        }, Promise.resolve())
    })
}

function createIdentifier (allocationName, typeShort, identifierName, identifierCategory) {
    console.log(`in createIdentifiers ${allocationName}`)
    const {getRelevantModel} = require('../_helpers/helpers')
    const level = 'Identifier'
    const otherTypeShorts = [
        'geography',
        'url',
        'offgrid',
        'format'
    ]

    if (typeShort === 'niche') {
        if (identifierCategory.includes('url') && identifierName.includes('.')) {
            typeShort = 'url'
        } else {
            let identifierShort = identifierCategory.split('_identifiers')[0]
            if (otherTypeShorts.indexOf(identifierShort) > -1) {
              typeShort = identifierShort
            }
        }
    }

    const {relevantModel, type} = getRelevantModel (typeShort, level)

    let findObj = {identifier_name: identifierName, primary_allocation: allocationName}
    const optionObj = {upsert: true, new: true}
    let newIdentifier = {
        identifier_name: identifierName,
        created_at: moment().tz('America/Chicago').toISOString(),
        identifier_category: identifierCategory,
        _type: type,
        primary_allocation: allocationName,
    }

    if (typeShort === 'unprocessed') {
        newIdentifier.identifier_category = undefined
        newIdentifier.primary_allocation = undefined
    }
    return relevantModel.findOneAndUpdate(findObj, newIdentifier, optionObj)
}

function moveIdentifier (allocationName, typeShort, identifierName) {
    console.log('in moveIdentifier')
    if (!allocationName || !typeShort || !identifierName) {
        console.log('missing key info')
        return Promise.resolve()
    } else {
        const {getRelevantModel} = require('../_helpers/helpers')
        const level = 'Identifier'
        const {relevantModel} = getRelevantModel (typeShort, level)
        const query = { primary_allocation: allocationName, identifier_name: identifierName }
        return Promise.resolve()
        .then(() => {
            return relevantModel.findOne(query)
        })
        .then((oldIdentifier) => {
            if (oldIdentifier) {
                const {_type, primary_allocation, identifier_name} = oldIdentifier
                const find = {_type, primary_allocation}
                const options = {upsert: true, new: true}
                const {IdentifierGraveyard} = require('../models/Identifier');
                return IdentifierGraveyard.findOneAndUpdate(find, oldIdentifier, options)
                .then((newIdentifier) => {
                    return relevantModel.deleteOne(query)
                })
                .then(() => {
                    return Promise.resolve()
                })
            } else {
                return Promise.resolve()
            }
        })
        .catch((error) => {
            console.log({error})
            return Promise.resolve()
        })
    }
}

function findUnprocessedIdentifiers () {
    console.log('in findUnprocessedIdentifiers')

    const IdentifierModels = require('../models/Identifier');
    let promises = []
    let typeShortsArray = []
    Object.keys(IdentifierModels).forEach((type) => {
        const relevantModel = IdentifierModels[type]
        let query = createEitherObject ('primary_allocation')
        if (type.includes('Unprocessed')) {
          query = {}
        }
        let typeShort = type.split('Identifier')[1]
        typeShort = typeShort.toLowerCase()
        typeShortsArray.push(typeShort)
        promises.push(relevantModel.find(query))
    })
    return Promise.all(promises)
    .then((promiseResults) => {
        let response = {}
        typeShortsArray.forEach((typeShort, index) => {
            response[typeShort] = promiseResults[index]
        })
        return response
    })
}

function createEitherObject (critera) {

    let c1 = {}
    c1[critera] = {$exists: false}
    let c2 = {}
    c2[critera] = null

    const object = { $or: [
        c1,
        c2
    ]}

    return object
}
