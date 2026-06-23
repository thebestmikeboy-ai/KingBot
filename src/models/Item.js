const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema(
  {
    itemId: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    description: { type: String, default: null },
    
    // Type
    type: { type: String, enum: ['weapon', 'armor', 'consumable', 'quest', 'misc'], required: true },
    
    // Stats
    damageBonus: { type: Number, default: 0 },
    armorBonus: { type: Number, default: 0 },
    healthRestore: { type: Number, default: 0 },
    manaRestore: { type: Number, default: 0 },
    
    // Economy
    buyPrice: { type: Number, required: true },
    sellPrice: { type: Number, required: true },
    rarity: { type: String, enum: ['common', 'uncommon', 'rare', 'epic', 'legendary'], default: 'common' },
    
    // Crafting
    craftable: { type: Boolean, default: false },
    craftRecipe: [{
      materialId: String,
      quantity: Number,
    }],
    
    // Requirements
    requiredLevel: { type: Number, default: 1 },
    requiredClass: [String],
    
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

itemSchema.index({ itemId: 1 });
itemSchema.index({ type: 1 });
itemSchema.index({ rarity: 1 });

module.exports = mongoose.model('Item', itemSchema);
