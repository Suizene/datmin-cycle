// backend/routes/motorcycles.js

const express = require('express');
const router = express.Router();

const { 
  getMotorcycles, 
  getMotorcycleById,
  addMotorcycle,
  updateMotorcycle,
  deleteMotorcycle
} = require('../controllers/motorcycleController');

const {
  getParts,
  addPart,
  updatePart,
  deletePart,
  listAllParts
} = require('../controllers/partController');

const auth = require('../middleware/auth');

// Semua route membutuhkan auth
router.use(auth);

/* ============================
   MOTORCYCLES ROUTES
============================ */

// Get all motorcycles
router.get('/', getMotorcycles);

// Get single motorcycle
router.get('/:motorcycleId', getMotorcycleById);

// Add motorcycle
router.post('/', addMotorcycle);

// Update motorcycle
router.put('/:motorcycleId', updateMotorcycle);

// Delete motorcycle
router.delete('/:motorcycleId', deleteMotorcycle);


/* ============================
   PARTS ROUTES
============================ */

// Get all parts for a motorcycle
router.get('/:motorcycleId/parts', getParts);

// Add new part
router.post('/:motorcycleId/parts', addPart);

// Update a part
router.put('/:motorcycleId/parts/:partId', updatePart);

// Delete a part
router.delete('/:motorcycleId/parts/:partId', deletePart);

// Debug route
router.get('/debug/parts', listAllParts);

module.exports = router;
