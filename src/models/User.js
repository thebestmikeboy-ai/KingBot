const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    phoneNumber: { type: String, required: true, unique: true },
    username: { type: String, required: true, unique: true },
    birthday: { type: Date, required: true },
    password: { type: String, default: null },
    
    // Leveling
    xp: { type: Number, default: 0 },
    level: { type: Number, default: 1 },
    league: { type: String, default: 'Anfänger' },
    leagueTier: { type: String, default: 'I' },
    
    // Profile
    gender: { type: String, default: null },
    sexuality: { type: String, default: null },
    mood: { type: String, default: null },
    aura: { type: Object, default: null },
    auraLastClaimed: { type: Date, default: null },
    relationshipStatus: { type: String, default: 'single' },
    relationshipPartner: { type: String, default: null },
    
    // Economy
    wallet: { type: Number, default: 0 },
    bank: { type: Number, default: 0 },
    totalMoney: { type: Number, default: 0 },
    
    // Daily Rewards
    dailyLastClaimed: { type: Date, default: null },
    weeklyLastClaimed: { type: Date, default: null },
    monthlyLastClaimed: { type: Date, default: null },
    yearlyLastClaimed: { type: Date, default: null },
    bonusLastClaimed: { type: Date, default: null },
    
    // Streak
    streak: { type: Number, default: 0 },
    streakLastClaimed: { type: Date, default: null },
    
    // User Info
    country: { type: String, default: null },
    region: { type: String, default: null },
    city: { type: String, default: null },
    hobbies: { type: String, default: null },
    bio: { type: String, default: null },
    profileImage: { type: String, default: null },
    
    // Reputation & Rating
    reputation: [{
      fromUser: String,
      text: String,
      date: { type: Date, default: Date.now },
    }],
    ratings: [{
      fromUser: String,
      rating: Number,
      date: { type: Date, default: Date.now },
    }],
    thankPoints: { type: Number, default: 0 },
    
    // Friends & Relationships
    friends: [String],
    marriedTo: { type: String, default: null },
    marriageDate: { type: Date, default: null },
    
    // Inventory & Items
    inventory: [{
      itemId: String,
      quantity: Number,
    }],
    
    // Milestones
    milestones: [{
      name: String,
      date: { type: Date, default: Date.now },
    }],
    
    // GDPR
    gdprAccepted: { type: Boolean, default: false },
    gdprAcceptedDate: { type: Date, default: null },
    termsAccepted: { type: Boolean, default: false },
    termsAcceptedDate: { type: Date, default: null },
    
    // Status
    isLoggedIn: { type: Boolean, default: false },
    isBlacklisted: { type: Boolean, default: false },
    lastActive: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

// Index für schnellere Suche
userSchema.index({ username: 1 });
userSchema.index({ phoneNumber: 1 });
userSchema.index({ level: -1 });
userSchema.index({ xp: -1 });

module.exports = mongoose.model('User', userSchema);
