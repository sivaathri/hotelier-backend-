const PropertyRules = require('./propertiesModels');

// Get all property rules
const getAllRules = async (req, res) => {
  try {
    const data = await PropertyRules.getAllRules();
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get rules by ID
const getRulesById = async (req, res) => {
  try {
    const data = await PropertyRules.getRulesById(req.params.id);
    res.json({ success: true, data });
  } catch (error) {
    res.status(404).json({ success: false, message: error.message });
  }
};

// Get rules by user ID
const getRulesByUserId = async (req, res) => {
  try {
    const data = await PropertyRules.getRulesByUserId(req.params.user_id);
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Create new rules
const createRules = async (req, res) => {
  try {
    const data = await PropertyRules.createRules(req.params.user_id, req.body);
    res.status(201).json({ success: true, message: "Property rules created", data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update rules
const updateRulesById = async (req, res) => {
  try {
    const data = await PropertyRules.updateRulesById(req.params.id, req.body);
    res.json({ success: true, message: "Rules updated", data });
  } catch (error) {
    res.status(error.message === "Property rules not found" ? 404 : 500).json({ success: false, message: error.message });
  }
};

// Delete rules
const deleteRulesById = async (req, res) => {
  try {
    await PropertyRules.deleteRulesById(req.params.id);
    res.json({ success: true, message: "Rules deleted" });
  } catch (error) {
    res.status(404).json({ success: false, message: error.message });
  }
};

module.exports = {
  getAllRules,
  getRulesById,
  getRulesByUserId,
  createRules,
  updateRulesById,
  deleteRulesById,
};
