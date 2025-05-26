const express = require('express');
const router = express.Router();
const propertyDetailsController = require('./PropertyDetailsController');

// Route to create or update property details
router.post('/create-or-update', propertyDetailsController.createOrUpdatePropertyDetails);

// Route to get property details by property_id
router.get('/:property_id', propertyDetailsController.getPropertyDetails);

module.exports = router;
