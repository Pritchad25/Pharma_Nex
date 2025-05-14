/**
 * @file: defining the routes for pharmacy related operations
 */

const express = require('express');
const router = express.Router();
const pharmacyController = require('../controllers/pharmacyController');
const authMiddleware = require('../middleware/auth');

router.post('/', authMiddleware, pharmacyController.registerPharmacy);
router.get('/', pharmacyController.listPharmacies);
router.get('/nearby', pharmacyController.nearByPharmacies);
router.get('/:id', pharmacyController.getPharmacyById);
router.patch('/:id', authMiddleware, pharmacyController.updatePharmacy);

module.exports = router;