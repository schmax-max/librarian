'use strict'
const {allocationCalcsFinal} = require('./allocationCalcsFinal')
const {allocationCalcsInitial} = require('./allocationCalcsInitial')
const {initialInfo} = require('./initialInfo')
 
module.exports = {
    allocationLoop
}

async function allocationLoop (input) {
    const initialPromiseResults = await initialInfo ()
    const types = [
        'niches',
        'geographies'
    ]
    const allocations = {}
    types.forEach((type) => {
        allocations[type] = allocationPerType (input, initialPromiseResults[type])
    })
    return allocations
}

function allocationPerType (input, {structure, allocations}) {
    // console.log({structure, allocations})
    const initialResponse = allocationCalcsInitial (input, structure, allocations)
    return allocationCalcsFinal (initialResponse)
}


