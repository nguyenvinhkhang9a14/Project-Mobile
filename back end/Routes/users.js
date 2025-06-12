// Routes/users.js
const express = require('express');
const router = express.Router();
const userController = require('../Controller/user');
const authMiddleware = require('../Middleware/authMiddleware');

//  Get all users 
router.get('/', authMiddleware.authenticateToken, authMiddleware.isAdmin, userController.findAll);

// G Get user by ID 
router.get('/:id', authMiddleware.authenticateToken, authMiddleware.isSelfOrAdmin, userController.findOne);

// Create a new user
router.post('/', userController.create);

// Update a user 
router.put('/:id', authMiddleware.authenticateToken, authMiddleware.isSelfOrAdmin, userController.update);

//  Delete a user 
router.delete('/:id', authMiddleware.authenticateToken, authMiddleware.isAdmin, userController.delete);

module.exports = router;
