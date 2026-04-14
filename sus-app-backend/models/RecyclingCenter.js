const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const AutoIncrement = require("mongoose-sequence")(mongoose);

const RecyclingCenterSchema = new Schema(
  {
    centreID: { type: Number, unique: true },
    name: { type: String, required: true },
    address: { type: String, required: true },
    phone_no: { type: String }, 
    email: { type: String, required: false },
    password: { type: String, required: true }, 
    website: { type: String },
    dist: { type: String, required: false },
    state: { type: String, required: true },
    country: { type: String, required: false }, 
    pincode: { type: String }, 
    city: { type: String, required: false } 
  },
  { timestamps: true }
);

RecyclingCenterSchema.plugin(AutoIncrement, { inc_field: 'centreID' });

const RecyclingCenter = mongoose.model("RecyclingCenter", RecyclingCenterSchema);
module.exports = RecyclingCenter;
