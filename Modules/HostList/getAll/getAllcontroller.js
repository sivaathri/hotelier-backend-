const GetAllInfo = require('./getAllModel');

const getallinfo = async (req, res) => {
    try {
        const properties = await GetAllInfo.getAllCombinedInfo();
        res.status(200).json({
            success: true,
            data: properties
        });
    } catch (error) {
        res.status(500).json({ 
            success: false,
            message: error.message 
        });
    }
};

const getHostById = async (req, res) => {
    try {
        const { id } = req.params;
        
        if (!id) {
            return res.status(400).json({
                success: false,
                message: "Host ID is required"
            });
        }

        const host = await GetAllInfo.getCombinedInfoById(id);
        
        if (!host) {
            return res.status(404).json({
                success: false,
                message: "Host not found"
            });
        }

        res.status(200).json({
            success: true,
            data: host
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const updateHost = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        if (!id) {
            return res.status(400).json({
                success: false,
                message: "Host ID is required"
            });
        }

        const updatedHost = await GetAllInfo.updateHostInfo(id, updateData);
        
        if (!updatedHost) {
            return res.status(404).json({
                success: false,
                message: "Host not found"
            });
        }

        res.status(200).json({
            success: true,
            data: updatedHost,
            message: "Host information updated successfully"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const deleteHost = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({
                success: false,
                message: "Host ID is required"
            });
        }

        const deletedHost = await GetAllInfo.deleteHostInfo(id);
        
        if (!deletedHost) {
            return res.status(404).json({
                success: false,
                message: "Host not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Host deleted successfully"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const getPropertyById = async (req, res) => {
    try {
        const { propertyId } = req.params;
        
        if (!propertyId) {
            return res.status(400).json({
                success: false,
                message: "Property ID is required"
            });
        }

        const property = await GetAllInfo.getCombinedInfoBypropertyId(propertyId);
        
        if (!property) {
            return res.status(404).json({
                success: false,
                message: "Property not found"
            });
        }

        res.status(200).json({
            success: true,
            data: property
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    getallinfo,
    getHostById,
    updateHost,
    deleteHost,
    getPropertyById
};
