const express = require('express');
const router = express.Router();
const destinationController = require('../controller/destinationController');
const { authenticate, authenticateToken, authorizeRole } = require('../middleware/authMiddleware');
const { validateDestinationCreation, validateDestinationUpdate } = require('../validations/destinationValidation');
const { body } = require('express-validator');
router.post(
  '/',
  authenticateToken,authorizeRole('admin'),
  validateDestinationCreation,
  destinationController.createDestination
);
router.get(
  '/',
  authenticateToken,
  destinationController.getAllDestinations);
router.get(
  '/:id',
  authenticateToken,
  destinationController.getDestinationById
);
router.put(
  '/:id',
  authenticateToken, validateDestinationUpdate,
  destinationController.updateDestination);
router.delete(
  '/:id',
  authenticateToken,
  authorizeRole('admin'),
  destinationController.deleteDestination
);
 router.post(
  '/search',
  authenticateToken,
  destinationController.searchDestinations)
module.exports = router;