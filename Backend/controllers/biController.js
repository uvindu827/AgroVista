import BuyerInventory from '../models/biModel.js';
import Joi from 'joi';
import fs from 'fs';
import path from 'path';


const today = new Date();
const formattedDate = `${today.getMonth() + 1}/${today.getDate()}/${today.getFullYear()}`;
console.log(formattedDate);

// Joi validation schema
const inventorySchema = Joi.object({
  buyerID:Joi.string().required(),
  productName: Joi.string().pattern(/^[A-Za-z\s]+$/).required().messages({
    'string.pattern.base': 'Product Name should contain only letters and spaces.',
    'string.empty': 'Product Name is required.',
  }),
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

    expirationDate: Joi.date()
  .min(formattedDate)
  .max(new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)) // 1 year from now
  .required()
  .messages({
    'date.min': 'Expiration date must be today or future (Within one year).',
    'date.max': 'Expiration date must be within one year from today.',
    'any.required': 'Expiration date is required.'
  }),

  manufactureDate: Joi.date()
  .iso()  // Ensures the date is in ISO 8601 format
  .max(today) // Only today’s date is valid
  .required()  // Ensures the date is required
  .messages({
    'date.base': 'Manufacture date must be a valid date.',
    'any.required': 'Manufacture date is required.',
    'date.max': 'Manufacture date - Only today\'s date is allowed.',
  }),

  category: Joi.string().pattern(/^[A-Za-z\s]+$/).required().messages({
    'string.pattern.base': 'Category should contain only letters and spaces.',
    'string.empty': 'Category is required.',
  }),

  description: Joi.string().optional(),
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

// Get buyer-specific inventory items with pagination and sorting
export const getInventories = async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 20, 
      sortBy = 'createdAt', 
      order = 'desc',
      buyerID,
      search,
      category 
    } = req.query;

    // Create query object
    let query = { buyerID };

    // Add search functionality
    if (search) {
      query.productName = { $regex: search, $options: 'i' };
    }

    // Add category filter
    if (category && category !== 'All') {
      query.category = category;
    }

    // Get paginated and filtered results
    const inventories = await BuyerInventory.find(query)
      .sort({ [sortBy]: order === 'desc' ? -1 : 1 })
      .skip((page - 1) * parseInt(limit))
      .limit(parseInt(limit));

    // Get total count for this query
    const count = await BuyerInventory.countDocuments(query);
    
    // Calculate total pages
    const totalPages = Math.ceil(count / parseInt(limit));

    res.json({ 
      inventories,
      total: count,
      currentPage: parseInt(page),
      totalPages,
      itemsPerPage: parseInt(limit)
    });

  } catch (err) {
    console.error('Error fetching inventories:', err);
    res.status(500).json({ 
      error: 'Server error.',
      details: process.env.NODE_ENV === 'development' ? err.message : undefined 
    });
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
export const updateInventory = async (req, res, next) => {
  const id = req.params.id;
  const { productName, price, stock, expirationDate, manufactureDate, category, description,productPicture } = req.body;

  let updatedInventory;

  try {
    updatedInventory = await BuyerInventory.findByIdAndUpdate(
      id,
      {
        productName,
        price,
        stock,
        expirationDate,
        manufactureDate,
        category,
        description,
        productPicture
      },
      { new: true } // Return the updated document
    );

    if (!updatedInventory) {
      return res.status(404).send({ message: "Inventory item not found" });
    }

    return res.status(200).send({ inventory: updatedInventory });

  } catch (err) {
    console.error(err);
    return res.status(500).send({ message: "Error updating inventory item" });
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



  export const getBuyerInventoryForCharts = async (req, res) => {
    try {
      const buyerId = req.user._id; // You must have authentication middleware that sets req.user
  
      const inventory = await BuyerInventory.find({ user: buyerId });
  
      res.status(200).json(inventory);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch buyer inventory data.' });
    }
  };