const express = require('express');
const router = express.Router();
const Pickup = require('../models/Pickup');
const pickupController = require('../controllers/pickupController');

// Define the route for scheduling pickups
router.post('/schedule-pickup', pickupController.schedulePickup);

// Route to fetch all scheduled pickups
router.get('/allPickups', pickupController.getAllPickups);

router.get("/provider", pickupController.getProviderPickups);

// UPDATE pickup status
router.patch('/pickups/:id', async (req, res) => {
  try {
    const { status } = req.body;
    const formattedStatus = status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();

    const validStatuses =  ['Scheduled', 'Accepted', 'Rejected', 'Collected', 'Completed'];

    if (!validStatuses.includes(formattedStatus)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const updatedPickup = await Pickup.findByIdAndUpdate(
      req.params.id,
      { status: formattedStatus },
      { new: true }
    );

    if (!updatedPickup) {
      return res.status(404).json({ message: 'Pickup not found' });
    }

    res.status(200).json({
      success: true,
      pickup: updatedPickup
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to update pickup', error });
  }
});

module.exports = router;
