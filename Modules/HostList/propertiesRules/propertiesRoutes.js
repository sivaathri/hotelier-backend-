const express = require('express');
const router = express.Router();
const controller = require('./propertiesController');
// CRUD for Properties
// Routes
router.get('/rules', controller.getAllRules);
router.get('/rule/:id', controller.getRulesById);
router.get('/user/:user_id/rules', controller.getRulesByUserId);
router.post('/rules/create/:user_id', controller.createRules);
router.put('/rules/:id', controller.updateRulesById);
router.delete('/rules/:id', controller.deleteRulesById);

module.exports = router;
