const Promise = require('bluebird');

function fetchStructures () {
    const {StructureUrl, StructureNiche, StructureGeography, StructureTrending, StructureFormat} = require('../models/Structure');
    let promises = []
    promises.push(StructureUrl.findOne())
    promises.push(StructureNiche.findOne())
    promises.push(StructureGeography.findOne())
    promises.push(StructureTrending.findOne())
    promises.push(StructureFormat.findOne())
    return Promise.all(promises)
    .then((results) => {
        // console.log({results})
        let structure = {
            urlStructure: results[0].structure,
            nicheStructure: results[1].structure,
            geographyStructure: results[2].structure,
            trendingStructure: results[3].structure,
            formatStructure: results[4].structure,
        }
        // console.log({structure})
        return structure
    })
}

module.exports = {
    fetchStructures
};
