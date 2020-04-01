const _ = require('lodash')
const {calcsPerAllocation} = require('./calcsPerAllocation')

function allocationCalcsInitial (input, structure, allAllocations) {
    const allocationCalcsInitial = Object.keys(structure).reduce((newObject, thisCategory) => {
        const relevantAllocations = structure[thisCategory]
        const thisValue = allocationCalcsInitialPerCategory (relevantAllocations, thisCategory, input, allAllocations)
        newObject[thisCategory] = thisValue
        return newObject
    }, {})
    return allocationCalcsInitial
}

function allocationCalcsInitialPerCategory (relevantAllocations, category, input, allAllocations) {
    // console.log({relevantAllocations, category})
    const allocationNumbersArray = relevantAllocations.reduce((newArray, allocation) => {
        if (allAllocations[allocation]) {
            const calcs = calcsPerAllocation (input, allAllocations[allocation])
            if (calcs && calcs.totalPoints > 0) {
                newArray.push(Object.assign(calcs, {category}, {allocation}))
            }
        }
        return newArray
    }, [])
    return allocationNumbersArray
}


module.exports = {
    allocationCalcsInitial
}
