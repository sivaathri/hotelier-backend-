const PropertyDetails = require('./PropertyDetailsModels');

// Create or update property details
exports.createOrUpdatePropertyDetails = async (req, res) => {
  try {
    const {
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
    } = req.body;

    // Create or update property details
    const result = await PropertyDetails.createOrUpdate({
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
    });

    res.status(200).json({
      success: true,
      message: result ? 'Property details updated successfully' : 'Property details created successfully',
      data: result,
    });
  } catch (error) {
    if (error.message === 'Property not found in basic_info table') {
      return res.status(404).json({ success: false, message: 'Property not found.' });
    }
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get property details by ID
exports.getPropertyDetails = async (req, res) => {
  try {
    const property_id = req.params.property_id;
    const propertyDetails = await PropertyDetails.getPropertyById(property_id);

    if (!propertyDetails) {
      return res.status(404).json({ success: false, message: 'Property details not found.' });
    }

    res.status(200).json({
      success: true,
      data: propertyDetails,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
