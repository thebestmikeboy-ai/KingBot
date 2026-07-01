const mongoose = require('mongoose');

const globalPollSchema = new mongoose.Schema(
  {
    pollId: { type: String, required: true, unique: true },
    question: { type: String, required: true },
    options: [{
      optionId: Number,
      text: String,
      votes: { type: Number, default: 0 },
    }],
    
    createdBy: { type: String, required: true },
    active: { type: Boolean, default: true },
    
    voters: [{
      userId: String,
      chosenOption: Number,
      votedAt: { type: Date, default: Date.now },
    }],
    
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

globalPollSchema.index({ pollId: 1 });
globalPollSchema.index({ active: 1 });

module.exports = mongoose.model('GlobalPoll', globalPollSchema);
