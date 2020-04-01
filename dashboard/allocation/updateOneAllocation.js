'use strict'
const Promise = require('bluebird')
const mongoose = require ('mongoose')
const moment = require ('moment-timezone')

module.exports = {
    updateOneAllocation,
}





function updateOneAllocation (body) {
    const {selectedAllocation, selectedAllocationType, mergedAllocationIdentifiers, formValues} = body
    console.log('in updateOneAllocation')
    return new Promise ((resolve, reject) => {
        const query = { allocation_name: selectedAllocation }
        // console.log({mergedAllocationIdentifiers})
        const {allocation_name, is_permanent, parent_category} = formValues
        const update = {
            identifiers: mergedAllocationIdentifiers,
            allocation_name,
            is_permanent,
            parent_category
        }
        const options = { upsert: true, new: true }
        const {getRelevantModel} = require('../_helpers/helpers')
        const level = 'Allocation'
        const {relevantModel} = getRelevantModel (selectedAllocationType, level)
        if (!mergedAllocationIdentifiers) {
            console.log('mergedAllocationIdentifiers is undefined')
            return
        } else {
            // console.log('has info')
            return relevantModel.updateOne(query, update, options)
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
