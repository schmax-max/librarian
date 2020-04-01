const {Allocation, Identifier} = require('../model')

module.exports = createIdentifiers

async function createIdentifiers () {
  const type = 'niches'
  
  const allocations = await Allocation[type].find()
  let iterations = allocations.length
  // iterations = 1
  for (let i=0; i<iterations; i++) {
    const parent_allocation = allocations[i].allocation_name
    const parent_allocation_id = allocations[i]._id
    const {identifiers} = allocations[i]
    // console.log({identifiers})

    for (identifier_type in identifiers) {
      const identifierArray = identifiers[identifier_type]
      let iterations = identifierArray.length
      // iterations = 1
      for (let i=0; i<iterations; i++) {
        const identifier_name = identifierArray[i]
        const object = {
            identifier_name,
            identifier_type,
            // identifier_segment: 'geography',
            parent_allocation,
            parent_allocation_id,
        }
        if (identifier_name && identifier_type !== 'blocked_identifiers') {
          const newIdentifier = await Identifier.niche.findOneAndUpdate({identifier_name}, object, {new: true, upsert: true})
          console.log('made new identifier')
          // console.log({newIdentifier})
        }
      }
      // console.log({identifierArray})
    }
  }

  

}