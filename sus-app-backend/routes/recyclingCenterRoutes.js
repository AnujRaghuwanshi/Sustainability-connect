const express = require('express');
const router = express.Router();
const RecyclingCenterController = require('../controllers/recyclingCenterController');

// Define routes and link them to controller functions
router.post('/login', RecyclingCenterController.loginRecyclingCenter);
router.get('/', RecyclingCenterController.getAllRecyclingCenters);
router.get('/centreID/:centreID', RecyclingCenterController.getRecyclingCenterByCentreID); // Add this line
router.get('/:id', RecyclingCenterController.getRecyclingCenterById);

router.post('/', RecyclingCenterController.createRecyclingCenter);
router.put('/:id', RecyclingCenterController.updateRecyclingCenter);
router.delete('/:id', RecyclingCenterController.deleteRecyclingCenter);

module.exports = router;
