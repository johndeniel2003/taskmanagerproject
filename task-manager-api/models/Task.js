const mongoose = require('mongoose');

const VALID_STATUSES = ['pending', 'in-progress', 'completed'];

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  status: {
    type: String,
    enum: VALID_STATUSES,
    default: 'pending'
  }
}, { timestamps: true }); 

module.exports = mongoose.model('Task', taskSchema);
