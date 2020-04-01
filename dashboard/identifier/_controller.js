const express = require('express');
const _ = require('lodash');
const router = express.Router();
const Promise = require('bluebird');

router.post('/updateOne', updateOneIdentifier);
router.post('/updateMany', updateManyIdentifiers);
router.get('/getUnprocessed', getUnprocessedIdentifiers);

module.exports = router;

function updateOneIdentifier(req, res, next) {
    console.log('in updateOneIdentifier')
    const {
      // identifierInfo,
    } = req.body
    return
    // const {updateIdentifier} = require('./identifierService');
    // let promises = []
    // promises.push(updateIdentifiers (deletableNicheIdentifiers, allocationNiche))
    // return Promise.all(promises)
    // .then(() => {
    //     let response = 'success'
    //     response ? res.send(response) : res.status(400).json({ message: 'No response found' })
    // })
    // .catch((err) => {
    //     console.log(err)
    //     next(err)
    // });
}


function updateManyIdentifiers(req, res, next) {
    console.log('in createIdentifiers')
    const {
        selectedAllocation,
        selectedAllocationType,
        deleteAllocationIdentifiers,
        newAllocationIdentifiers,
        newUnprocessedIdentifiers
    } = req.body
    const {changeManyIdentifiers} = require('./identifierService');
    let promises = []
    promises.push(changeManyIdentifiers (selectedAllocation, selectedAllocationType, deleteAllocationIdentifiers, 'move'))
    promises.push(changeManyIdentifiers (selectedAllocation, selectedAllocationType, newAllocationIdentifiers, 'create'))
    promises.push(changeManyIdentifiers (selectedAllocation, selectedAllocationType, newUnprocessedIdentifiers, 'create'))
    return Promise.all(promises)
    .then(() => {
        let response = 'success'
        response ? res.send(response) : res.status(400).json({ message: 'No response found' })
    })
    .catch((err) => {
        console.log(err)
        next(err)
    });
}

function getUnprocessedIdentifiers (req, res, next) {
    const {findUnprocessedIdentifiers} = require('./identifierService');
    return findUnprocessedIdentifiers()
    .then((response) => {
        // console.log('made it here')
        response ? res.send(response) : res.status(400).json({ message: 'No response found' })
    })
    .catch((err) => {
        console.log(err)
        next(err)
    })
}
