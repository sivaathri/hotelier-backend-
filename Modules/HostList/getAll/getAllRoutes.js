const express = require('express');
const router = express.Router();
const getAllcontroller = require('./getAllcontroller');

router.get('/all', getAllcontroller.getallinfo);
router.get('/property/:propertyId', getAllcontroller.getPropertyById);
router.get('/:id', getAllcontroller.getHostById);
router.put('/:id', getAllcontroller.updateHost);







module.exports = router;   