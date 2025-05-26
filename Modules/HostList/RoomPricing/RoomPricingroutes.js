const express = require('express');
const router = express.Router();
const roomPricingController = require('./RoomPricingContoller');

// Route to create room pricing
router.post('/create', roomPricingController.createRoomPricing);

module.exports = router;
