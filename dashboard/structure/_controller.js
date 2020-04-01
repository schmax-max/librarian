const express = require('express');
const _ = require('lodash');
const router = express.Router();
const Promise = require('bluebird');

router.get('/getAll', getAllStructures);
router.post('/updateOne', updateOneStructure);

module.exports = router;

function getAllStructures (req, res, next) {
    console.log('in getAllStructures')
    const {fetchStructures} = require('./fetchStructures')
    return fetchStructures()
    .then((structure) => {
        // console.log({structure})
        structure ? res.send(structure) : res.status(400).json({ message: 'No structure found' })
    })
    .catch((err) => {
        console.log(err)
        next(err)
    });
}

function updateOneStructure (req, res, next) {
    console.log('in updateOneStructure')
    const {
        viewShown,
        mergedStructure
    } = req.body

    const {getRelevantModel} = require('../_helpers/helpers')
    const level = 'Structure'
    const {relevantModel, type} = getRelevantModel (viewShown, level)
    const find = {}
    const update = {structure: mergedStructure, _type: type}
    const options = {upsert: true, new: false}
    // console.log({mergedStructure})
    // return

    return relevantModel.updateOne(find, update, options)
    .then((newStructure) => {
        // console.log({newStructure})
        newStructure ? res.send(newStructure) : res.status(400).json({ message: 'No newStructure found' })
    })
    .catch((err) => {
        console.log(err)
        next(err)
    });
}
