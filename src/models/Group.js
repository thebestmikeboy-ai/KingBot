const mongoose = require('mongoose');

const groupSchema = new mongoose.Schema(
  {
    groupId: { type: String, required: true, unique: true },
    groupName: { type: String, required: true },
    owner: { type: String, required: true },
    prefix: { type: String, default: 'X' },
    
    // Settings
    settings: {
      adminOnly: { type: Boolean, default: false },
      messagesToAdmin: { type: Boolean, default: false },
      addMembersAdmin: { type: Boolean, default: false },
      inviteByLink: { type: Boolean, default: true },
      joinRequest: { type: Boolean, default: false },
    },
    
    // Security
    antilink: { type: Boolean, default: false },
    linkDelete: { type: Boolean, default: false },
    linkDeleteCount: { type: Number, default: 3 },
    antispam: { type: Boolean, default: false },
    warnCount: { type: Number, default: 3 },
    
    // Features
    features: {
      leveling: { type: Boolean, default: true },
      gambling: { type: Boolean, default: true },
      fun: { type: Boolean, default: true },
      reactions: { type: Boolean, default: true },
      rpg: { type: Boolean, default: true },
    },
    
    // Messages
    welcomeEnabled: { type: Boolean, default: false },
    welcomeMessage: { type: String, default: 'Willkommen in der Gruppe! 👋' },
    goodbyeEnabled: { type: Boolean, default: false },
    goodbyeMessage: { type: String, default: 'Auf Wiedersehen! 👋' },
    
    // Warnings
    warnings: [{
      userId: String,
      count: Number,
      lastWarning: { type: Date, default: Date.now },
      reasons: [String],
    }],
    
    // Members
    members: [{
      userId: String,
      joinedAt: { type: Date, default: Date.now },
      isAdmin: Boolean,
      isBot: Boolean,
    }],
    
    // Link Whitelist
    linkWhitelist: [{
      userId: String,
      allowedCount: Number,
    }],
    
    // Group Stats
    totalMessages: { type: Number, default: 0 },
    totalCommands: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

// Index
groupSchema.index({ groupId: 1 });
groupSchema.index({ owner: 1 });

module.exports = mongoose.model('Group', groupSchema);
