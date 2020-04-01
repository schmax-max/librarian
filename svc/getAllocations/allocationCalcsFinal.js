module.exports = {
    allocationCalcsFinal
}

const {inputValues} = require('./inputValues')

function allocationCalcsFinal (allocationCalcsInitial) {
    // console.log({allocationCalcsInitial})
    const all = {}
    let primary
    let highestTagsCountCore = 0
    let highestTotalPoints = 0

    allocationCalcsInitial.forEach((item) => {
        const {allocation, tagCounts, totalPoints} = item

        if (totalPoints > 0) {
            all[allocation] = item
        }

        if (
            tagCounts.core > highestTagsCountCore ||
            (tagCounts.core === highestTagsCountCore && totalPoints > highestTotalPoints)
        ) {
            highestTagsCountCore = tagCounts.core
            highestTotalPoints = totalPoints
            primary = item
        }

    })
    return {all, primary}
}
