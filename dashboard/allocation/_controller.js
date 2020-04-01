const express = require('express');
const Promise = require('bluebird');
const _ = require('lodash');
const router = express.Router();



router.post('/get', getAllocationCtrl);
router.post('/updateOne', updateOneAllocationCtrl);
router.post('/updateMany', updateManyAllocationsCtrl);
router.get('/updateMost', updateMostAllocationsCtrl);



module.exports = router;


function getAllocationCtrl(req, res, next) {
  console.log('in getAllocationCtrl')
  const {selectedAllocation, selectedAllocationType, fetchSettings} = req.body
  const {getAllocation} = require('./getAllocation');
  return getAllocation (selectedAllocation, selectedAllocationType, fetchSettings)
  .then((response) => {
      res.send(response)
  })
  .catch((err) => {
      console.log(err)
      next(err)
  });
}


function updateOneAllocationCtrl(req, res, next) {
  // const {authFunc} = require('../_helpers/auth');
  // authFunc()
  console.log('in updateOneAllocationCtrl')
  const {updateOneAllocation} = require('./updateOneAllocation');
  return updateOneAllocation (req.body)
  .then(updatedAllocation => updatedAllocation ? res.send(updatedAllocation) : res.status(400).json({ message: 'No updatedAllocation found' }))
  .catch((err) => {
      console.log(err)
      next(err)
  });
}

function updateManyAllocationsCtrl(req, res, next) {
  console.log('in updateManyAllocationsCtrl')
  const {updateManyAllocations} = require('./updateManyAllocations');
  const {viewShown, newStructureAllocations, deleteStructureAllocations} = req.body
  let promises = []
  promises.push(updateManyAllocations (viewShown, newStructureAllocations, 'create'))
  promises.push(updateManyAllocations (viewShown, deleteStructureAllocations, 'move'))
  return Promise.all(promises)
  .then(allocation => allocation ? res.send(allocation) : res.status(400).json({ message: 'No allocation found' }))
  .catch((err) => {
      console.log(err)
      next(err)
  });
}


function updateMostAllocationsCtrl(req, res, next) {
  console.log('in updateMostAllocationsCtrl')
  const {updateMostAllocations} = require('./updateMostAllocations');
  return updateMostAllocations()
  .then(result => result ? res.send(result) : res.status(400).json({ message: 'No result found' }))
  .catch((err) => {
      console.log(err)
      next(err)
  });
}
