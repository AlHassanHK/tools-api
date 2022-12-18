const mongoose = require("mongoose");

const groceriesSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  size: {
    type: String,
    required: true
  },
  colour: {
    type: String,
    required: true
  }
});


const groceries = mongoose.model("groceries", groceriesSchema);

module.exports = groceries;
