'use strict'
const Promise = require('bluebird')
const mongoose = require ('mongoose')
const moment = require ('moment-timezone')

module.exports = {
    updateManyAllocations,
}


function updateManyAllocations (typeShort, allocationsObject, option) {
    console.log('in updateManyAllocations')
    return Object.keys(allocationsObject).forEach((parentCategory) => {
        const allocationsArray = allocationsObject[parentCategory]
        return allocationsArray.reduce((promise, allocationName) => {
            return promise
            .then(() => {
                // console.log({allocationName, typeShort, parentCategory})
                // return Promise.resolve()
                if (option === 'create') {
                    return createAllocation(allocationName, typeShort, parentCategory)
                }
                else if (option === 'move') {
                    return moveAllocation(allocationName, typeShort)
                } else {
                    console.log('triggering basic resolve')
                    return Promise.resolve()
                }
            })
        }, Promise.resolve())
    })
}

function createAllocation (allocationName, typeShort, parentCategory) {
    console.log('in createAllocation')
    return new Promise ((resolve, reject) => {
        const {getRelevantModel} = require('../_helpers/helpers')
        const level = 'Allocation'
        const {relevantModel, type} = getRelevantModel (typeShort, level)

        const query = { allocation_name: allocationName }
        const newAllocation = {
            allocation_name: allocationName,
            created_at: moment().tz('America/Chicago').toISOString(),
            _type: type,
            parent_category: parentCategory,
            identifiers: {},
        }
        const options = { upsert: true, new: true }

        if (!allocationName || !typeShort || !parentCategory) {
            console.log('missing key info')
            return
        } else {
            // console.log('has info')
            return relevantModel.updateOne(query, newAllocation, options)
                .then((latestAllocation) => {
                    // console.log({latestAllocation})
                    return resolve(latestAllocation)
                })
                .catch((error) => {
                    console.log({error})
                    return resolve(null)
                })
        }

    })
}

function moveAllocation (allocationName, typeShort) {
    console.log('in moveAllocation')
    const level = 'Allocation'
    const {getRelevantModel} = require('../_helpers/helpers')
    const {relevantModel} = getRelevantModel (typeShort, level)
    const query = { allocation_name: allocationName }
    if (!allocationName || !typeShort) {
        console.log('missing key info')
        return Promise.resolve()
    } else {
        return Promise.resolve()
        .then(() => {
            return relevantModel.findOne(query)
        })
        .then((oldAllocation) => {
            if (oldAllocation) {
                const {_type, allocation_name, identifiers} = oldAllocation
                const find = {_type, allocation_name}
                const options = {upsert: true, new: true}

                const identifiersLength = Object.keys(identifiers).length
                let promises = []
                if (identifiersLength > 0) {
                    const {AllocationGraveyard} = require('../models/Allocation');
                    promises.push(AllocationGraveyard.findOneAndUpdate(find, oldAllocation, options))
                }

                return Promise.all(promises)
                .then((newAllocations) => {
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
            return null
        })
    }
}
