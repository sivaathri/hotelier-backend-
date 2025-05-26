const Room = require('./roomSetupModels');
// GET all rooms
const getAllRooms = async (req, res) => {
  try {
    const rooms = await Room.getAllRooms();
    res.status(200).json({ success: true, data: rooms });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET single room
const getRoomById = async (req, res) => {
  try {
    const room = await Room.getRoomById(req.params.id);
    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }
    res.status(200).json({ success: true, data: room });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST create room
const createRoom = async (req, res) => {
  try {
    const { property_id, user_id, floor, room_type, number_of_rooms} = req.body;

    // Validate required fields
    if (!property_id) {
      return res.status(400).json({ message: 'Property ID is required' });
    }
    if (!user_id) {
      return res.status(400).json({ message: 'User ID is required' });
    }
    if (!floor) {
      return res.status(400).json({ message: 'Floor is required' });
    }
    if (!room_type) {
      return res.status(400).json({ message: 'Room type is required' });
    }
    if (!number_of_rooms) {
      return res.status(400).json({ message: 'Number of rooms is required' });
    }
   

    const insertId = await Room.createRoom(req.body);
    res.status(201).json({ success: true, insertId });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// PUT update room
const updateRoom = async (req, res) => {
  try {
    await Room.updateRoom(req.params.id, req.body);
    res.status(200).json({ success: true, message: 'Room updated successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE room
const deleteRoom = async (req, res) => {
  try {
    await Room.deleteRoom(req.params.id);
    res.status(200).json({ success: true, message: 'Room deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllRooms,
  getRoomById,
  createRoom,
  updateRoom,
  deleteRoom
};
