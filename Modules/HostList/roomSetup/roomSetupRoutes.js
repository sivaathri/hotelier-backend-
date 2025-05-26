const express = require('express');
const router = express.Router();
const RoomSetupController = require('./roomSetupController');

// GET all rooms
router.get('/', RoomSetupController.getAllRooms);

// GET single room
router.get('/:id', RoomSetupController.getRoomById);

// POST create room
router.post('/', RoomSetupController.createRoom);

// PUT update room
router.put('/:id', RoomSetupController.updateRoom);

// DELETE room
router.delete('/:id', RoomSetupController.deleteRoom);

module.exports = router;
