const express = require('express');
const router = express.Router();
const specialtyController = require('../Controller/specialty');
const authMiddleware = require('../Middleware/authMiddleware');

// GET /api/specialties - Get all specialties (public)
router.get('/', specialtyController.findAll);

// GET /api/specialties/:id - Get specialty by ID (public)
router.get('/:id', specialtyController.findOne);

// POST /api/specialties - Create a new specialty (admin only)
router.post('/', authMiddleware.authenticateToken, authMiddleware.isAdmin, specialtyController.create);

// PUT /api/specialties/:id - Update a specialty (admin only)
router.put('/:id', authMiddleware.authenticateToken, authMiddleware.isAdmin, specialtyController.update);

// DELETE /api/specialties/:id - Delete a specialty (admin only)
router.delete('/:id', authMiddleware.authenticateToken, authMiddleware.isAdmin, specialtyController.delete);

module.exports = router; 