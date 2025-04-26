import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

export const summarizeText = async (req, res) => {
  try {
    const { text } = req.body;
    
    if (!text) {
      return res.status(400).json({ 
        success: false, 
        message: 'Text content is required for summarization' 
      });
    }
    
    // Call Hugging Face API with your token from environment variable
    const response = await axios.post(
      'https://api-inference.huggingface.co/models/facebook/bart-large-cnn',
      {
        inputs: text,
        parameters: {
          max_length: 100,
          min_length: 30,
          do_sample: false
        }
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.HUGGING_FACE_API_KEY}`
        }
      }
    );
    
    // Extract summary from response
    const summaryText = response.data[0]?.summary_text || response.data[0] || response.data;
    
    res.json({ 
      success: true, 
      summary: summaryText 
    });
  } catch (error) {
    console.error('Summarization API error:', error.response?.data || error.message);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to generate summary' 
    });
  }
};