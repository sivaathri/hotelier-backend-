const express = require('express');
const router = express.Router();

const basicInfoController = require('./basicInfoController');

// Get all properties
router.get('/properties', basicInfoController.getAllProperties);

// Get property by ID (support both formats)
router.get('/property/:id', basicInfoController.getPropertyById);
router.get('/properties/:id', basicInfoController.getPropertyById);

// Create a new listing with user_id in URL
router.post('/create/:user_id', basicInfoController.createBasicInfo);

// Update property by ID
// router.put('/property/:id', basicInfoController.updatePropertyById);
router.put('/properties/:id', basicInfoController.updatePropertyById);

// Delete property by ID
router.delete('/property/:id', basicInfoController.deletePropertyById);
router.delete('/properties/:id', basicInfoController.deletePropertyById);

// Get properties by user ID
router.get('/user/:user_id/properties', basicInfoController.getUserProperties);

module.exports = router;                                                                                                                                                                                                                                                                    