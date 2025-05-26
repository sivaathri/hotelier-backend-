const db = require('../../../config/db'); 

class Room {
  static async getAllRooms() {
    const [rows] = await db.query('SELECT * FROM room_setup');
    return rows;
  }

  static async getRoomById(room_id) {
    const [rows] = await db.query('SELECT * FROM room_setup WHERE room_id = ?', [room_id]);
    return rows[0];
  }

  static async getRoomsByUserId(user_id) {
    const [rows] = await db.query('SELECT * FROM room_setup WHERE user_id = ?', [user_id]);
    return rows;
  }

  static async createRoom(data) {
    const {
      user_id,
      property_id,
      floor,
      room_type,
      number_of_rooms,
     
    } = data;
  
    const [result] = await db.query(
      `INSERT INTO room_setup 
      (user_id, property_id, floor, room_type, number_of_rooms) 
      VALUES (?, ?, ?, ?, ?)`,
      [
        user_id,
        property_id,
        floor,
        room_type,
        number_of_rooms,
      
      ]
    );
    return result.insertId;
  }
  
  static async updateRoom(room_id, data) {
    const {
      user_id,
      floor,
      room_type,
      number_of_rooms,
  
    } = data;

    const [result] = await db.query(
      `UPDATE room_setup SET user_id = ?, floor = ?, room_type = ?, number_of_rooms = ? 
      
      WHERE room_id = ?`,
      [
        user_id,
        floor,
        room_type,
        number_of_rooms,
        room_id
      ]
    );
    return result;
  }

  static async deleteRoom(room_id) {
    const [result] = await db.query('DELETE FROM room_setup WHERE room_id = ?', [room_id]);
    return result;
  }
}

module.exports = Room;
