import express from 'express';
import { 
  createInventory, getInventories, getInventoryById, updateInventory, deleteInventory 
} from '../controllers/biController.js';
import multer from 'multer';
import jwt from 'jsonwebtoken';

const router = express.Router();

// Multer config for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'public/uploads/'),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});

const upload = multer({ storage });

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access denied. No token provided.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret');
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ error: 'Invalid token.' });
  }
};

// CRUD routes
router.post('/', authenticateToken, upload.single('productPicture'), createInventory);
router.get('/', authenticateToken, getInventories);
router.get('/:id', authenticateToken, getInventoryById);
router.put('/:id', authenticateToken, upload.single('productPicture'), updateInventory);
router.delete('/:id', authenticateToken, deleteInventory);

export default router;