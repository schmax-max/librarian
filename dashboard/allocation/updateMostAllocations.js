const Promise = require('bluebird')

function updateMost () {
    console.log('in updateMost')
    const {StructureNiche, StructureUrl, StructureFormat, StructureGeography, StructureTrending} = require('../models/Structure');
    const {AllocationNiche, AllocationUrl, AllocationFormat, AllocationGeography, AllocationTrending} = require('../models/Allocation');
    let promises = []
    promises.push(updateMostPerStructure (StructureNiche, AllocationNiche, 'AllocationNiche'))
    promises.push(updateMostPerStructure (StructureUrl, AllocationUrl, 'AllocationUrl'))
    promises.push(updateMostPerStructure (StructureGeography, AllocationGeography, 'AllocationGeography'))
    promises.push(updateMostPerStructure (StructureTrending, AllocationTrending, 'AllocationTrending'))
    promises.push(updateMostPerStructure (StructureFormat, AllocationFormat, 'AllocationFormat'))
    return Promise.all(promises)
    .then(() => {
        console.log('done')
        return
    })
}


function updateMostPerStructure (structureModel, allocationModel, type) {
    console.log('in updateMostPerStructure')
    return structureModel.findOne()
    .then((structureObject) => {
        const {structure} = structureObject

        return Object.keys(structure).reduce((promise, parentCategory) => {
            return promise
            .then(() => {
                const relevantAllocations = structure[parentCategory]
                // console.log({relevantAllocations})
                return Promise.each(relevantAllocations, (allocationName) => {
                    const find = {allocation_name: allocationName}
                    const update = {
                        allocation_name: allocationName,
                        parent_category: parentCategory,
                        _type: type
                    }
                    const options = {new: true, upsert: true}
                    return allocationModel.updateOne(find, update, options)
                    // return allocationModel.countDocuments(find)
                    .then((result) => {
                        // console.log({result})
                        return
                    })
                })

            })
        }, Promise.resolve())
    })


    const {AllocationGraveyard} = require('../models/Allocation');

}

module.exports = {updateMost}
