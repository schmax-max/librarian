module.exports = {
    allocationCalcsFinal
}

const {inputValues} = require('./inputValues')

function allocationCalcsFinal (allocationCalcsInitial) {
    const {all, primary} = loopAllocations (allocationCalcsInitial)
    const location = getLocation (primary)
    return { all, location, primary }
}

function loopAllocations (allocationCalcsInitial) {
    // console.log({allocationCalcsInitial})
    const all = {}
    let primary
    let highestTagsCountCore = 0
    let highestTotalPoints = 0

    Object.keys(allocationCalcsInitial).forEach((category) => {
        allocationCalcsInitial[category].forEach((item) => {
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
    })
    return {all, primary}
}

function getLocation (primary) {
    const location = {
        allocation: 'potluck',
        category: 'potluck'
    }
    
    if (primary && primary.allocation) {
        const {niche_points_cutoff, niche_counts_cutoff} = inputValues.topics
        const hasEnoughPoints = primary.totalPoints >= niche_points_cutoff
        const hasEnoughTags = primary.totalCounts >= niche_counts_cutoff

        if (hasEnoughPoints && hasEnoughTags) {
            location.allocation = primary.allocation
            location.category = primary.category
        }
    }

    return location
}