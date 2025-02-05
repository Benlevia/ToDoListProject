// backend/models/Task.js
const mongoose = require("mongoose");

const TaskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  deadline: {
    type: Date,
    required: true,
  },
});

module.exports = mongoose.model("Task", TaskSchema);
