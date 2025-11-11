import axios from 'axios';

// Example: OpenAI API integration (replace with your API key and endpoint)
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';

export const chatWithAIAssistant = async (req, res) => {
  const { message, location } = req.body;
  if (!message || !location) {
    return res.status(400).json({ error: 'Message and location are required.' });
  }

  try {
    // Compose prompt with location context
    const prompt = `You are a helpful AI assistant for farmers. The farmer is located at latitude ${location.lat}, longitude ${location.lng}. Answer the following question with location-specific advice: ${message}`;

    // OpenAI API call (ChatGPT)
    const response = await axios.post(
      OPENAI_API_URL,
      {
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: 'You are a helpful assistant for farmers.' },
          { role: 'user', content: prompt }
        ]
      },
      {
        headers: {
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const aiReply = response.data.choices[0].message.content;
    res.json({ reply: aiReply });
  } catch (error) {
    console.error('AI Assistant error:', error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to get AI response.' });
  }
};
