const BasicInfo = require('./basicInfoModels')

// Get all properties
const getAllProperties = async (req, res) => {
    try {
        const properties = await BasicInfo.getAllProperties();
        res.status(200).json({
            success: true,
            data: properties
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get property by ID
const getPropertyById = async (req, res) => {
    try {
        const { id } = req.params;
        
        if (!id) {
            return res.status(400).json({ 
                success: false,
                message: "Property ID is required" 
            });
        }

        try {
            const property = await BasicInfo.getPropertyById(id);
            res.status(200).json({
                success: true,
                data: property
            });
        } catch (error) {
            if (error.message === 'Property not found') {
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
};

const createBasicInfo = async (req, res) => {
    try {
        const { property_name, property_type } = req.body;
        const user_id = req.params.user_id;

        // Validate required fields
        if (!property_name) {
            return res.status(400).json({
                success: false,
                message: "Property name is required"
            });
        }
        if (!property_type) {
            return res.status(400).json({
                success: false,
                message: "Property type is required"
            });
        }
        if (!user_id) {
            return res.status(400).json({
                success: false,
                message: "User ID is required"
            });
        }

        // Validate property type
        const validTypes = ['Hotel', 'Apartment', 'Hut House', 'Resort', 'Beach House', 'Villa'];
        if (!validTypes.includes(property_type)) {
            return res.status(400).json({
                success: false,
                message: "Invalid property type. Must be one of: " + validTypes.join(', ')
            });
        }

        try {
            const result = await BasicInfo.createBasicInfo(user_id, property_name, property_type);
            res.status(201).json({
                success: true,
                message: "Property created successfully",
                data: result
            });
        } catch (error) {
            if (error.message === 'Property name already exists') {
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
};

// Update property by ID
const updatePropertyById = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = {};

        // Only include properties that are provided in the request
        if (req.body.property_name) {
            updates.property_name = req.body.property_name;
        }
        if (req.body.property_type) {
            updates.property_type = req.body.property_type;
        }

        // Check if at least one field is being updated
        if (Object.keys(updates).length === 0) {
            return res.status(400).json({
                success: false,
                message: "At least one field (property_name or property_type) must be provided for update"
            });
        }

        try {
            const result = await BasicInfo.updatePropertyById(id, updates);
            res.status(200).json({
                success: true,
                message: "Property updated successfully",
                data: result
            });
        } catch (error) {
            if (error.message === 'Property name already exists') {
                return res.status(409).json({
                    success: false,
                    message: error.message
                });
            } else if (error.message === 'Property not found') {
                return res.status(404).json({
                    success: false,
                    message: error.message
                });
            } else if (error.message.includes('Invalid property type')) {
                return res.status(400).json({
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
};

// Delete property by ID
const deletePropertyById = async (req, res) => {
    try {
        const { id } = req.params;
        await BasicInfo.deletePropertyById(id);
        res.status(200).json({
            success: true,
            message: "Property deleted successfully"
        });
    } catch (error) {
        if (error.message === 'Property not found') {
            res.status(404).json({ message: error.message });
        } else {
            res.status(500).json({ message: error.message });
        }
    }
};

// Get properties by user ID
const getUserProperties = async (req, res) => {
    try {
        const { user_id } = req.params;
        const properties = await BasicInfo.getPropertiesByUserId(user_id);
        res.status(200).json({
            success: true,
            data: properties
        });
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
};

module.exports = {
    getAllProperties,
    getPropertyById,
    createBasicInfo,
    updatePropertyById,
    deletePropertyById,
    getUserProperties
}

