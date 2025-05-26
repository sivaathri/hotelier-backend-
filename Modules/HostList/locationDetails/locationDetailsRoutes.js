const express = require('express');
const router = express.Router();
const locationDetailsController = require('./locationDetailsController');

// Get all locations
router.get('/locations', locationDetailsController.getAllLocations);

// Create location details for a user
router.post('/create/:userId', locationDetailsController.createLocation);

// Get location details by ID
router.get('/location/:id', locationDetailsController.getLocation);

// Update location details
router.put('/location/:id', locationDetailsController.updateLocation);

// Delete location details
router.delete('/location/:id', locationDetailsController.deleteLocation);

module.exports = router;
