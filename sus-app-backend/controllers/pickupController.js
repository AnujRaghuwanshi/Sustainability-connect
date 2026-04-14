const Pickup = require('../models/Pickup');
const mongoose = require("mongoose");

exports.schedulePickup = async (req, res) => {
  try {
    const pickup = new Pickup(req.body);
    await pickup.save();
    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error saving pickup:', error);
    res.status(500).json({ success: false, error: 'Failed to save pickup' });
  }
};

exports.getAllPickups = async (req, res) => {
  try {
    const pickups = await Pickup.find({});
    res.status(200).json({ success: true, pickups });
  } catch (error) {
    console.error('Error fetching pickups:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch pickups' });
  }
};

exports.getProviderPickups = async (req, res) => {
  try {
    const centerId = req.query.center; 

    const pickups = await Pickup.find({ 
      center: new mongoose.Types.ObjectId(centerId)
     });

    res.status(200).json(pickups);
  } catch (error) {
    console.error("Error fetching provider pickups:", error);
    res.status(500).json({ error: "Failed to fetch pickups" });
  }
};
