const mongoose = require('mongoose');

const reminderSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['water', 'sunlight'],
    required: true,
  },
  interval: {
    type: Number, // in hours or days, depending on what you choose
    required: true,
  },
  unit: {
    type: String,
    enum: ['hours', 'days'],
    default: 'days',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

const plantSchema = new mongoose.Schema({
  name: { type: String, required: true },
  species: { type: String },
  careInstructions: { type: String, default: '' },
  reminders: [reminderSchema],
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });

module.exports = mongoose.model('Plant', plantSchema);
