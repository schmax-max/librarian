const Promise = require('bluebird')

const {Allocation, Structure} = require('../../model')



async function initialInfo () {
    try {
        types = [
            'niches',
            // 'urls',
            // 'geographies',
        ]
        const response = {}
        for (let i=0; i<types.length; i++) {
            const type = types[i]
            const structure = await getStructure (type)
            const allocations = await getAllocations (type)
            response[type] = {structure, allocations}
        }
        return response
    } catch(e) {
        console.log({e})
        return
    }
}

async function getStructure (type) {
    try {
        const {structure} = await Structure[type].findOne().sort({ created_at: -1 })
        return structure
    } catch(e) {
        console.log({e})
        return
    }
}

async function getAllocations (type) {
    try {
        const allocationNiches = await Allocation[type].find()
        const collection = {}
        allocationNiches.forEach((item) => {
            const {allocation_name} = item
            collection[allocation_name] = item
        })
        return collection
    } catch(e) {
        console.log({e})
        return
    }

}

module.exports = {
    initialInfo
}
