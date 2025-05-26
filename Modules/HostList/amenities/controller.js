const FacilitiesModel = require('../amenities/models');

exports.saveFacilities = async (req, res) => {
  try {
    const property_id = parseInt(req.params.property_id);
    const data = req.body;

    if (!property_id || isNaN(property_id)) {
      return res.status(400).json({ success: false, message: "Invalid property ID" });
    }

    const updatedFacilities = await FacilitiesModel.createOrUpdate(property_id, data);

    res.status(200).json({
      success: true,
      message: 'Facilities saved successfully',
      data: updatedFacilities
    });

  } catch (error) {
    console.error('Error saving facilities:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

exports.getFacilities = async (req, res) => {
  try {
    const property_id = parseInt(req.params.property_id);

    const facilities = await FacilitiesModel.getByPropertyId(property_id);

    if (!facilities) {
      return res.status(404).json({ success: false, message: 'Facilities not found' });
    }

    res.status(200).json({ success: true, data: facilities });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
