const LocationDetails = require('./locationDetailsModels');

const locationDetailsController = {
    createLocation: async (req, res) => {
        try {
            const { addressLine1, addressLine2, city, state_province, country, postalCode, latitude, longitude, property_id } = req.body;
            const userId = req.params.userId;

            // Validate required fields
            if (!addressLine1) {
                return res.status(400).json({
                    success: false,
                    message: "Address Line 1 is required"
                });
            }
            if (!city) {
                return res.status(400).json({
                    success: false,
                    message: "City is required"
                });
            }
            if (!state_province) {
                return res.status(400).json({
                    success: false,
                    message: "State/Province is required"
                });
            }
            if (!country) {
                return res.status(400).json({
                    success: false,
                    message: "Country is required"
                });
            }
            if (!postalCode) {
                return res.status(400).json({
                    success: false,
                    message: "Postal Code is required"
                });
            }
            if (!latitude) {
                return res.status(400).json({
                    success: false,
                    message: "Latitude is required"
                });
            }
            if (!longitude) {
                return res.status(400).json({
                    success: false,
                    message: "Longitude is required"
                });
            }
            if (!userId) {
                return res.status(400).json({
                    success: false,
                    message: "User ID is required"
                });
            }
            if (!property_id) {
                return res.status(400).json({
                    success: false,
                    message: "Property ID is required"
                });
            }

            const locationData = {
                userId: userId,
                property_id: property_id,
                addressLine1: addressLine1,
                addressLine2: addressLine2 || null,
                city: city,
                state_province: state_province,
                country: country,
                postalCode: postalCode,
                latitude: latitude,
                longitude: longitude
            };

            try {
                const result = await LocationDetails.createLocationDetails(locationData);
                res.status(201).json({
                    success: true,
                    message: "Location details created successfully",
                    data: result
                });
            } catch (error) {
                if (error.message === 'Location already exists') {
                    return res.status(409).json({
                        success: false,
                        message: error.message
                    });
                }
                throw error;
            }
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    },

    getLocation: async (req, res) => {
        try {
            const locationId = req.params.id;
            
            if (!locationId) {
                return res.status(400).json({
                    success: false,
                    message: "Location ID is required"
                });
            }

            const location = await LocationDetails.getLocationDetailsById(locationId);
            
            if (!location) {
                return res.status(404).json({
                    success: false,
                    message: "Location details not found"
                });
            }

            res.status(200).json({
                success: true,
                data: location
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    },

    getAllLocations: async (req, res) => {
        try {
            const locations = await LocationDetails.getAllLocationDetails();
            
            res.status(200).json({
                success: true,
                count: locations.length,
                data: locations
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    },

    updateLocation: async (req, res) => {
        return ("req",req.body)
        try {
            const locationId = req.params.id;
            const { addressLine1, addressLine2, city, state_province, country, postalCode, latitude, longitude } = req.body;

            if (!locationId) {
                return res.status(400).json({
                    success: false,
                    message: "Location ID is required"
                });
            }

            // Validate required fields
            if (!addressLine1) {
                return res.status(400).json({
                    success: false,
                    message: "Address Line 1 is required"
                });
            }
            if (!city) {
                return res.status(400).json({
                    success: false,
                    message: "City is required"
                });
            }
            if (!state_province) {
                return res.status(400).json({
                    success: false,
                    message: "State/Province is required"
                });
            }
            if (!country) {
                return res.status(400).json({
                    success: false,
                    message: "Country is required"
                });
            }
            if (!postalCode) {
                return res.status(400).json({
                    success: false,
                    message: "Postal Code is required"
                });
            }
            if (!latitude) {
                return res.status(400).json({
                    success: false,
                    message: "Latitude is required"
                });
            }
            if (!longitude) {
                return res.status(400).json({
                    success: false,
                    message: "Longitude is required"
                });
            }

            const locationData = {
                addressLine1: addressLine1,
                addressLine2: addressLine2 || null,
                city: city,
                state_province: state_province,
                country: country,
                postalCode: postalCode,
                latitude: latitude,
                longitude: longitude
            };

            try {
                const result = await LocationDetails.updateLocationDetails(locationId, locationData);
                
                if (result.affectedRows === 0) {
                    return res.status(404).json({
                        success: false,
                        message: "Location details not found"
                    });
                }

                res.status(200).json({
                    success: true,
                    message: "Location details updated successfully",
                    data: result
                });
            } catch (error) {
                if (error.message === 'Location not found') {
                    return res.status(404).json({
                        success: false,
                        message: error.message
                    });
                }
                throw error;
            }
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    },

    deleteLocation: async (req, res) => {
        try {
            const locationId = req.params.id;
            
            if (!locationId) {
                return res.status(400).json({
                    success: false,
                    message: "Location ID is required"
                });
            }

            const result = await LocationDetails.deleteLocationDetails(locationId);
            
            res.status(200).json({
                success: true,
                message: result.message
            });
        } catch (error) {
            if (error.message === 'Location not found') {
                return res.status(404).json({
                    success: false,
                    message: error.message
                });
            }
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }
};

module.exports = locationDetailsController;
