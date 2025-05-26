const db = require('../../../config/db'); // Make sure you have the db connection set up

class PropertyDetails {
  // Check if property exists in basic_info table
  static async checkPropertyExists(property_id) {
    const query = 'SELECT property_id FROM basic_info WHERE property_id = ?';
    const [result] = await db.query(query, [property_id]);
    return result.length > 0;
  }

  // Get property details by property_id
  static async getPropertyById(property_id) {
    const query = 'SELECT * FROM property_details WHERE property_id = ?';
    const [result] = await db.query(query, [property_id]);
    return result.length > 0 ? result[0] : null;
  }

  // Create or update property details
  static async createOrUpdate({
    property_id,
    description,
    nearest_beach_distance,
    nearest_railway_station_distance,
    nearest_airport_distance,
    nearest_bus_stand_distance,
    can_book_married_couples,
    can_book_families,
    can_book_solo_travelers,
    can_book_friends,
    instant_booking,
    manual_approval,
  }) {
    // First check if the property exists in basic_info
    const propertyExists = await this.checkPropertyExists(property_id);
    if (!propertyExists) {
      throw new Error('Property not found in basic_info table');
    }

    // Check if the property details already exist for the given property_id
    const existingProperty = await this.getPropertyById(property_id);

    let query = '';
    let values = [];

    if (existingProperty) {
      // Update query
      query = `
        UPDATE property_details SET 
        description = ?, 
        nearest_beach_distance = ?, 
        nearest_railway_station_distance = ?, 
        nearest_airport_distance = ?, 
        nearest_bus_stand_distance = ?, 
        can_book_married_couples = ?, 
        can_book_families = ?, 
        can_book_solo_travelers = ?, 
        can_book_friends = ?, 
        instant_booking = ?, 
        manual_approval = ? 
        WHERE property_id = ?
      `;
      values = [
        description,
        nearest_beach_distance,
        nearest_railway_station_distance,
        nearest_airport_distance,
        nearest_bus_stand_distance,
        can_book_married_couples,
        can_book_families,
        can_book_solo_travelers,
        can_book_friends,
        instant_booking,
        manual_approval,
        property_id,
      ];
    } else {
      // Insert query
      query = `
        INSERT INTO property_details (
          property_id, description, nearest_beach_distance, 
          nearest_railway_station_distance, nearest_airport_distance, 
          nearest_bus_stand_distance, can_book_married_couples, 
          can_book_families, can_book_solo_travelers, can_book_friends, 
          instant_booking, manual_approval
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;
      values = [
        property_id,
        description,
        nearest_beach_distance,
        nearest_railway_station_distance,
        nearest_airport_distance,
        nearest_bus_stand_distance,
        can_book_married_couples,
        can_book_families,
        can_book_solo_travelers,
        can_book_friends,
        instant_booking,
        manual_approval,
      ];
    }

    const [result] = await db.query(query, values);
    return result;
  }
}

module.exports = PropertyDetails;
