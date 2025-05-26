const db = require('../../../config/db'); 

class FacilitiesModel {
  static async createOrUpdate(property_id, data) {
    // Check if facilities already exist
    const [exists] = await db.query(
      'SELECT property_id FROM facilities_amenities WHERE property_id = ?',
      [property_id]
    );

    const fields = Object.keys(data);
    const values = Object.values(data);

    if (exists.length > 0) {
      // Update existing record
      const updateQuery = `
        UPDATE facilities_amenities 
        SET ${fields.map(field => `${field} = ?`).join(', ')} 
        WHERE property_id = ?`;

      await db.query(updateQuery, [...values, property_id]);
    } else {
      // Insert new record
      const insertQuery = `
        INSERT INTO facilities_amenities 
        (property_id, ${fields.join(', ')}) 
        VALUES (?, ${fields.map(() => '?').join(', ')})`;

      await db.query(insertQuery, [property_id, ...values]);
    }

    return { property_id, ...data };
  }

  static async getByPropertyId(property_id) {
    const [rows] = await db.query(
      'SELECT * FROM facilities_amenities WHERE property_id = ?',
      [property_id]
    );
    return rows[0];
  }
}

module.exports = FacilitiesModel;
