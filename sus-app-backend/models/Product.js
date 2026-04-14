const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// 🔥 Import plugin
const AutoIncrement = require('mongoose-sequence')(mongoose);

// Define the Product schema
const ProductSchema = new Schema({
  name: { type: String, required: true },
  productID: { type: Number, unique: true },
  description: String,
  price: { type: Number, required: true },
  categoryID: { type: Number, required: true },
  image_url: [String] 
});

// 🔥 Apply plugin
ProductSchema.plugin(AutoIncrement, { inc_field: 'productID' });

// Create and export the model
const Product = mongoose.model("Product", ProductSchema);
module.exports = Product;
 