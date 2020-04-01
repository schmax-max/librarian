module.exports = changeAllocations
const {Allocation, Category} = require('../model');

async function changeAllocations () {
  console.log(`starting changeAllocations`)
  const oldAllocations = await Allocation.find({parent_category: 'russia_/_cis'})
  console.log({oldAllocations})
  for (let i=0; i<oldAllocations.length; i++) {
    await changeAllocation (oldAllocations[i])
  }
}

async function changeAllocation (oldAllocation) {
  const {allocation_name} = oldAllocation
  console.log(`running changeAllocation for ${allocation_name}`)
  // if (oldAllocation.allocation_niche) {
  //     oldAllocation.allocation_name = oldAllocation.allocation_niche
  //     oldAllocation.allocation_niche = undefined
  // }
  //
  // if (oldAllocation.allocation_category) {
  //     oldAllocation.parent_category = oldAllocation.allocation_category
  //     oldAllocation.allocation_category = undefined
  // }

  // if (!oldAllocation.identifiers) {
  //     console.log(`no identifiers for ${allocation_name}`)
  //     oldAllocation.identifiers = {}
  // }

  // oldAllocation._type = undefined
  // oldAllocation.created_at = undefined
  // oldAllocation.identifiers = undefined
  const find = {
    category_name: 'europe_/_cis'
  }

  let category_name, _id
  const category = await Category.findOne(find)
  if (category) {
    ({category_name, _id} = category)
    
  } else {
    console.log(`error with ${allocation_name}`)
  }

  oldAllocation.parent_category = category_name
  oldAllocation.parent_category_id = _id

  // console.log({oldAllocation})
  // let changes = {
  //   identifier_url: 'url_identifier',
  //   host_url: 'url_domain'
  // }

  // for (old in changes) {
  //   const newName = changes[old]
  //   if (oldAllocation.identifiers[old]) {
  //     oldAllocation.identifiers[newName] = oldAllocation.identifiers[old]
  //     delete(oldAllocation.identifiers[old])
  //   }
  // }

  // oldAllocation.markModified('identifiers')
  await oldAllocation.save((error, newNiche) => {
      if (error) {
          console.log({error})
      } else {
          console.log(`success new oldAllocation`)
      }
  })
}