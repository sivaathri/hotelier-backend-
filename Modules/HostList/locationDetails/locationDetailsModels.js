const db = require("../../../config/db");

class LocationDetails {
  static async checkLocationExists(locationData) {
    try {
      const [result] = await db.query(
        `SELECT * FROM location_details 
        WHERE address_line1 = ? 
        AND city = ? 
        AND state_province = ? 
        AND country = ? 
        AND postal_code = ? 
        AND (address_line2 = ? OR (address_line2 IS NULL AND ? IS NULL))
        AND latitude = ?
        AND longitude = ?`,
        [
          locationData.addressLine1,
          locationData.city,
          locationData.state_province,
          locationData.country,
          locationData.postalCode,
          locationData.addressLine2,
          locationData.addressLine2,
          locationData.latitude,
          locationData.longitude
        ]
      );

      return result.length > 0;
    } catch (error) {
      console.error('Error checking location existence:', error);
      throw error;
    }
  }

  static async createLocationDetails(locationData) {
    try {
      // Validate required fields
      if (!locationData.latitude || !locationData.longitude) {
        throw new Error('Latitude and longitude are required');
      }

      // Check if location already exists
      const exists = await this.checkLocationExists(locationData);
      if (exists) {
        throw new Error('Location already exists');
      }

      const [result] = await db.query(
        `INSERT INTO location_details 
        (user_id, property_id, address_line1, address_line2, city, state_province, country, postal_code, latitude, longitude) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          locationData.userId,
          locationData.property_id,
          locationData.addressLine1,
          locationData.addressLine2 || null,
          locationData.city,
          locationData.state_province,
          locationData.country,
          locationData.postalCode,
          locationData.latitude,
          locationData.longitude
        ]
      );

      return {
        id: result.insertId,
        ...locationData
      };
    } catch (error) {
      console.error('Error creating location details:', error);
      throw error;
    }
  }

  static async getLocationDetailsById(id) {
    try {
      const [result] = await db.query(
        `SELECT * FROM location_details WHERE id = ?`,
        [id]
      );
      return result[0] || null;
    } catch (error) {
      console.error('Error getting location details:', error);
      throw error;
    }
  }

  static async getLocationDetailsByUserId(userId) {
    try {
      const [result] = await db.query(
        `SELECT * FROM location_details WHERE user_id = ?`,
        [userId]
      );
      return result[0] || null;
    } catch (error) {
      console.error('Error getting location details by user ID:', error);
      throw error;
    }
  }

  static async getAllLocationDetails() {
    try {
      const [result] = await db.query(
        `SELECT * FROM location_details ORDER BY created_at DESC`
      );
      return result;
    } catch (error) {
      console.error('Error getting all location details:', error);
      throw error;
    }
  }

  static async updateLocationDetails(id, locationData) {
    try {
      // Validate required fields
      if (!locationData.latitude || !locationData.longitude) {
        throw new Error('Latitude and longitude are required');
      }

      // Check if location exists before updating
      const existingLocation = await this.getLocationDetailsById(id);
      if (!existingLocation) {
        throw new Error('Location not found');
      }

      // Check if the new data would create a duplicate
      const exists = await this.checkLocationExists({
        ...locationData,
        addressLine2: locationData.addressLine2 || existingLocation.address_line2
      });

      if (exists) {
        throw new Error('Location already exists');
      }

      const [result] = await db.query(
        `UPDATE location_details 
        SET address_line1 = ?, 
            address_line2 = ?, 
            city = ?, 
            state_province = ?, 
            country = ?, 
            postal_code = ?, 
            latitude = ?, 
            longitude = ? 
        WHERE id = ?`,
        [
          locationData.addressLine1,
          locationData.addressLine2 || null,
          locationData.city,
          locationData.state_province,
          locationData.country,
          locationData.postalCode,
          locationData.latitude,
          locationData.longitude,
          id
        ]
      );

      return {
        affectedRows: result.affectedRows,
        ...locationData
      };
    } catch (error) {
      console.error('Error updating location details:', error);
      throw error;
    }
  }

  static async deleteLocationDetails(id) {
    try {
      // Check if location exists before deleting
      const existingLocation = await this.getLocationDetailsById(id);
      if (!existingLocation) {
        throw new Error('Location not found');
      }

      const [result] = await db.query(
        `DELETE FROM location_details WHERE id = ?`,
        [id]
      );

      return {
        affectedRows: result.affectedRows,
        message: 'Location details deleted successfully'
      };
    } catch (error) {
      console.error('Error deleting location details:', error);
      throw error;
    }
  }
}

module.exports = LocationDetails;
