const mongoose = require('mongoose');

const PickupSchema = new mongoose.Schema({
  name: String,
  email: String,
  address: String,
  center:  {
    type: mongoose.Schema.Types.ObjectId,
    ref: "RecyclingCenter",
    required: true
  },
  pincode: String,
  contact: String,
  wasteType: String,
  quantity: Number,
  date: String,
  status: {
  type: String,
  enum: ['Scheduled', 'Accepted', 'Rejected','Collected', 'Completed'],
  default: 'Scheduled'   // ✅ THIS LINE
}
});

const Pickup = mongoose.model('Pickup', PickupSchema);
module.exports = Pickup;
