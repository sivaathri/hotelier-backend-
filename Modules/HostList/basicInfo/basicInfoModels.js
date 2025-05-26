const db = require('../../../config/db')

class BasicInfo {
  // Get all properties
  static async getAllProperties() {
    const [rows] = await db.query('SELECT * FROM basic_info');
    return rows;
  }

  // Get property by ID
  static async getPropertyById(id) {
    if (!id) {
      throw new Error('Property ID is required');
    }

    const [rows] = await db.query(
      'SELECT * FROM basic_info WHERE property_id = ?',
      [parseInt(id)]
    );

    if (rows.length === 0) {
      throw new Error('Property not found');
    }

    return rows[0];
  }

  // Check if property name exists
  
  static async createBasicInfo(
    user_id,
    property_name,
    property_type
  ){
    

    const [result] = await db.query(
      `INSERT INTO basic_info (user_id, property_name, property_type) VALUES (?, ?, ?)`,
      [user_id, property_name, property_type]
    );
    
    return {
      property_id: result.insertId,
      user_id,
      property_name,
      property_type,
    };
    
  }

  // Update property by ID
  static async updatePropertyById(id, updates) {
    if (!id) {
      throw new Error('Property ID is required');
    }

    // First check if property exists and get current data
    const [existingProperty] = await db.query(
      'SELECT * FROM basic_info WHERE property_id = ?',
      [parseInt(id)]
    );

    if (existingProperty.length === 0) {
      throw new Error('Property not found');
    }

    const currentProperty = existingProperty[0];
    const property_name = updates.property_name || currentProperty.property_name;
    const property_type = updates.property_type || currentProperty.property_type;

    // Only check for duplicate name if name is being updated
    if (updates.property_name) {
      const [existing] = await db.query(
        'SELECT property_id FROM basic_info WHERE property_name = ? AND property_id != ?',
        [property_name, id]
      );
      
      if (existing.length > 0) {
        throw new Error('Property name already exists');
      }
    }

    // Only validate property type if it's being updated
    if (updates.property_type) {
      const validTypes = ['Hotel', 'Apartment', 'Hut House', 'Resort', 'Beach House', 'Villa'];
      if (!validTypes.includes(property_type)) {
        throw new Error('Invalid property type. Must be one of: ' + validTypes.join(', '));
      }
    }

    const [result] = await db.query(
      `UPDATE basic_info SET property_name = ?, property_type = ? WHERE property_id = ?`,
      [property_name, property_type, parseInt(id)]
    );
    
    if (result.affectedRows === 0) {
      throw new Error('Failed to update property');
    }

    // Get the updated property
    const [updated] = await db.query(
      'SELECT * FROM basic_info WHERE property_id = ?',
      [parseInt(id)]
    );
    
    return updated[0];
  }

  // Delete property by ID
  static async deletePropertyById(id) {
    const [result] = await db.query(
      'DELETE FROM basic_info WHERE property_id = ?',
      [id]
    );
    
    if (result.affectedRows === 0) {
      throw new Error('Property not found');
    }
    
    return true;
  }

  // Get properties by user ID
  static async getPropertiesByUserId(user_id) {
    const [rows] = await db.query(
      'SELECT * FROM basic_info WHERE user_id = ?',
      [user_id]
    );
    return rows;
  }
}

module.exports = BasicInfo
