const express = require('express');
const router = express.Router();
const userController = require('./userController');
const auth = require('../../middleware/auth');

// Public routes
router.post('/register', userController.register);
router.post('/login', userController.login);

// Protected routes
router.get('/profile', auth, userController.getProfile);
router.get('/', auth, userController.getAllUsers);
router.get('/:id', auth, userController.getUser);
router.put('/:id', auth, userController.updateUser);
router.delete('/:id', auth, userController.deleteUser);
router.put('/profile', auth, userController.updateProfile);
router.put('/password/:id', auth, userController.updatePassword);

module.exports = router; 