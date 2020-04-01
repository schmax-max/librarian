const _ = require('lodash')
const {calcsPerAllocation} = require('./calcsPerAllocation')

function allocationCalcsInitial (body, allocations) {
    // console.log({relevantAllocations, category})
    return Object.keys(allocations).reduce((newArray, allocation) => {

        const identifiers = allocations[allocation]
        const calcs = calcsPerAllocation (body, identifiers)
        if (calcs && calcs.totalPoints > 0) {
            newArray.push(Object.assign(calcs, {allocation}))
        }
        return newArray
    }, [])
}


module.exports = {
    allocationCalcsInitial
}
