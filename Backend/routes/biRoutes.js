import express from 'express';
import { 
  createInventory, getInventories, getInventoryById, updateInventory, deleteInventory , getBuyerInventoryForCharts 
} from '../controllers/biController.js';
import multer from 'multer';




const router = express.Router();

// Multer config for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),  // Upload directory
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)  // Unique filename
});

const upload = multer({ storage });  // Initialize multer

// CRUD routes
router.post('/', upload.single('productPicture'), createInventory);  // Create
router.get('/', getInventories);  // Get all items
//router.get('/:buyerID', getInventories);
router.get('/:id', getInventoryById);  // Get by ID
//router.put('/:id', updateInventory);  // Update
router.put('/:id', upload.single('productPicture'), updateInventory);  // Update with file upload
router.delete('/:id', deleteInventory);  // Delete

router.get('/buyer/charts', getBuyerInventoryForCharts);

export default router;
