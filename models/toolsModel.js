const mongoose = require("mongoose");

const toolSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  weight: {
    type: String,
    required: true
  },
  isPoweredTool: {
    type: Boolean,
    required: true
  }
});


const tools = mongoose.model("tools", toolSchema);

module.exports = tools;
