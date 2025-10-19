import express from 'express';
import { chatWithAIAssistant } from '../controllers/aiAssistantController.js';

const router = express.Router();
router.post('/chat', chatWithAIAssistant);

export default router;
