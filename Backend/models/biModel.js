import mongoose from 'mongoose';

// Buyer Inventory Schema
const buyerInventorySchema = new mongoose.Schema({

  buyerID:{
    type:String,
    required:true
  },
  productName: {  // Product name
    type: String,
    required: true,
    trim: true
  },
  price: {  // Price per 100 grams
    type: Number,
    required: true,
    min: 0
  },
  
  stock: {  // Stock in grams
    type: Number,
    required: true,
    min: 0
  },
  expirationDate: {  // Expiry date
    type: Date,
    required: true
  },
  manufactureDate: {  // Manufacture date
    type: Date,
    required: true
  },
  category: {  // Product category
    type: String,
    required: true,
    trim: true
  },
  description: {  // Product description (optional)
    type: String,
    trim: true
  }
}, { timestamps: true });  // Auto add createdAt and updatedAt

const BuyerInventory = mongoose.model('BuyerInventory', buyerInventorySchema);
export default BuyerInventory;
