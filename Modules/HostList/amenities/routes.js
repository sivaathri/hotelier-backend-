const express = require('express');
const router = express.Router();
const facilitiesController = require('../amenities/controller');

// Save or update facilities
router.post('/facilities/:property_id', facilitiesController.saveFacilities);

// Get facilities for a property
router.get('/facilities/:property_id', facilitiesController.getFacilities);

module.exports = router;
