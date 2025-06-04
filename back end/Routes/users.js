// Routes/users.js
const express = require('express');
const router = express.Router();
const userController = require('../Controller/user');
const authMiddleware = require('../Middleware/authMiddleware');

// GET /api/users - Get all users (admin only)
router.get('/', authMiddleware.authenticateToken, authMiddleware.isAdmin, userController.findAll);

// GET /api/users/:id - Get user by ID (self or admin)
router.get('/:id', authMiddleware.authenticateToken, authMiddleware.isSelfOrAdmin, userController.findOne);

// POST /api/users - Create a new user (public - for registration)
router.post('/', userController.create);

// PUT /api/users/:id - Update a user (self or admin)
router.put('/:id', authMiddleware.authenticateToken, authMiddleware.isSelfOrAdmin, userController.update);

// DELETE /api/users/:id - Delete a user (admin only)
router.delete('/:id', authMiddleware.authenticateToken, authMiddleware.isAdmin, userController.delete);

module.exports = router;
