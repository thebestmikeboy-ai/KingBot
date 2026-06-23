const mongoose = require('mongoose');

const rpgCharacterSchema = new mongoose.Schema(
  {
    characterId: { type: String, required: true, unique: true },
    userId: { type: String, required: true },
    characterName: { type: String, required: true },
    
    // Basic Stats
    level: { type: Number, default: 1 },
    experience: { type: Number, default: 0 },
    health: { type: Number, default: 100 },
    maxHealth: { type: Number, default: 100 },
    mana: { type: Number, default: 50 },
    maxMana: { type: Number, default: 50 },
    
    // Class & Race
    class: { type: String, enum: ['Warrior', 'Mage', 'Archer', 'Rogue', 'Paladin'], default: 'Warrior' },
    race: { type: String, enum: ['Human', 'Elf', 'Dwarf', 'Orc', 'Gnome'], default: 'Human' },
    
    // Attributes
    strength: { type: Number, default: 10 },
    intelligence: { type: Number, default: 10 },
    dexterity: { type: Number, default: 10 },
    constitution: { type: Number, default: 10 },
    wisdom: { type: Number, default: 10 },
    charisma: { type: Number, default: 10 },
    
    // Equipment
    equippedWeapon: { type: String, default: null },
    equippedArmor: { type: String, default: null },
    equippedHelmet: { type: String, default: null },
    equippedRing: { type: String, default: null },
    equippedAmulet: { type: String, default: null },
    
    // Inventory
    inventory: [{
      itemId: String,
      quantity: Number,
    }],
    
    // Skills
    skills: [{
      skillName: String,
      level: Number,
    }],
    
    // Combat Stats
    wins: { type: Number, default: 0 },
    losses: { type: Number, default: 0 },
    totalDamageDealt: { type: Number, default: 0 },
    totalDamageTaken: { type: Number, default: 0 },
    
    // Pet
    pet: { type: String, default: null },
    
    // Guild
    guildId: { type: String, default: null },
    
    // Location
    currentLocation: { type: String, default: 'Town' },
    
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

rpgCharacterSchema.index({ userId: 1 });
rpgCharacterSchema.index({ level: -1 });

module.exports = mongoose.model('RPGCharacter', rpgCharacterSchema);
