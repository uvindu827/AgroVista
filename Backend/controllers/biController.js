import BuyerInventory from '../models/biModel.js';
import Joi from 'joi';
import fs from 'fs';
import path from 'path';

// Joi validation schema
const inventorySchema = Joi.object({
  productName: Joi.string().required(),
  price: Joi.number().min(0).required()  // Price per 1 kilograms
    .messages({
      'number.min': 'Price must be a positive number.',
      'any.required': 'Price is required.'
    }),
  productPicture: Joi.string().optional(),  // Allow optional product picture
  stock: Joi.number().min(0).required()  // Stock in kilograms
    .messages({
      'number.min': 'Stock must be at least 0 kilograms.',
      'any.required': 'Stock is required.'
    }),
  expirationDate: Joi.date().required(),
  manufactureDate: Joi.date().required(),
  category: Joi.string().required(),
  description: Joi.string().optional()
});

// Create inventory item
export const createInventory = async (req, res) => {
  try {
    const { error } = inventorySchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    const productPicture = req.file ? req.file.path : undefined;  // Optional picture

    const newItem = new BuyerInventory({
      ...req.body,
      productPicture
    });

    await newItem.save();
    res.status(201).json(newItem);
  } catch (err) {
    res.status(500).json({ error: 'Server error.' });
  }
};

// Get all inventory items with pagination and sorting
export const getInventories = async (req, res) => {
  try {
    const { page = 1, limit = 10, sortBy = 'createdAt', order = 'desc' } = req.query;
    
    const inventories = await BuyerInventory.find()
      .sort({ [sortBy]: order === 'desc' ? -1 : 1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const count = await BuyerInventory.countDocuments();
    
    res.json({ total: count, page, inventories });
  } catch (err) {
    res.status(500).json({ error: 'Server error.' });
  }
};

// Get inventory by ID
export const getInventoryById = async (req, res) => {
  try {
    const inventory = await BuyerInventory.findById(req.params.id);
    if (!inventory) return res.status(404).json({ error: 'Item not found.' });

    res.json(inventory);
  } catch (err) {
    res.status(500).json({ error: 'Server error.' });
  }
};

// Update inventory item
export const updateInventory = async (req, res) => {
  try {
    const { error } = inventorySchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    const inventory = await BuyerInventory.findById(req.params.id);
    if (!inventory) return res.status(404).json({ error: 'Item not found.' });

    // Handle optional picture update
    if (req.file) {
      if (inventory.productPicture) {  // Delete old picture
        fs.unlinkSync(path.resolve(inventory.productPicture));
      }
      inventory.productPicture = req.file.path;
    }

    // Update other details
    Object.assign(inventory, req.body);
    
    await inventory.save();
    
    res.json(inventory);
  } catch (err) {
    res.status(500).json({ error: 'Server error.' });
  }
};

// Delete inventory item
export const deleteInventory = async (req, res) => {
    try {
      const inventory = await BuyerInventory.findById(req.params.id);
      
      if (!inventory) {
        return res.status(404).json({ error: 'Item not found.' });
      }
  
      // Delete image if it exists
      if (inventory.productPicture) {
        const filePath = path.resolve(inventory.productPicture);
        
        if (fs.existsSync(filePath)) {  // Check if the file exists
          fs.unlinkSync(filePath);  // Delete the image
        } else {
          console.warn(`File not found for deletion: ${filePath}`);
        }
      }
  
      await inventory.deleteOne();  // Delete the inventory item
  
      res.json({ message: 'Item deleted successfully.' });
    } catch (err) {
      console.error('Error deleting inventory item:', err.message);  // Log error message
      res.status(500).json({ error: `Server error: ${err.message}` });  // Return detailed error
    }
  };
  
