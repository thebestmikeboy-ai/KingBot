const mongoose = require('mongoose');

const supportSchema = new mongoose.Schema(
  {
    ticketId: { type: String, required: true, unique: true },
    userId: { type: String, required: true },
    message: { type: String, required: true },
    
    category: { type: String, enum: ['bug', 'suggestion', 'support', 'other'], default: 'other' },
    status: { type: String, enum: ['open', 'in-progress', 'resolved', 'closed'], default: 'open' },
    priority: { type: String, enum: ['low', 'medium', 'high', 'critical'], default: 'medium' },
    
    response: { type: String, default: null },
    respondedBy: { type: String, default: null },
    respondedAt: { type: Date, default: null },
    
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

supportSchema.index({ ticketId: 1 });
supportSchema.index({ userId: 1 });
supportSchema.index({ status: 1 });

module.exports = mongoose.model('Support', supportSchema);
