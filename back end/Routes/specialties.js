const express = require('express');
const router = express.Router();
const specialtyController = require('../Controller/specialty');
const authMiddleware = require('../Middleware/authMiddleware');

// G Get all specialties 
router.get('/', specialtyController.findAll);

//  Get specialty by ID 
router.get('/:id', specialtyController.findOne);

// Create a new specialty 
router.post('/', authMiddleware.authenticateToken, authMiddleware.isAdmin, specialtyController.create);

// Update a specialty 
router.put('/:id', authMiddleware.authenticateToken, authMiddleware.isAdmin, specialtyController.update);

// Delete a specialty 
router.delete('/:id', authMiddleware.authenticateToken, authMiddleware.isAdmin, specialtyController.delete);

module.exports = router; 