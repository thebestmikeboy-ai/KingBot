const mongoose = require('mongoose');

const guildSchema = new mongoose.Schema(
  {
    guildId: { type: String, required: true, unique: true },
    guildName: { type: String, required: true },
    leader: { type: String, required: true },
    description: { type: String, default: null },
    
    // Members
    members: [{
      userId: String,
      joinedAt: { type: Date, default: Date.now },
      rank: { type: String, default: 'Member' }, // Leader, Officer, Member
      contribution: { type: Number, default: 0 },
    }],
    
    // Bank
    guildBank: { type: Number, default: 0 },
    bankSlots: { type: Number, default: 10 },
    
    // Stats
    level: { type: Number, default: 1 },
    experience: { type: Number, default: 0 },
    wins: { type: Number, default: 0 },
    losses: { type: Number, default: 0 },
    
    // Perks
    perks: [String],
    
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

guildSchema.index({ guildId: 1 });
guildSchema.index({ leader: 1 });

module.exports = mongoose.model('Guild', guildSchema);
