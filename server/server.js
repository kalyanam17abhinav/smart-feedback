import express from 'express';
import cors from 'cors';
import { createRequire } from 'module';
import { insertFeedback, getAllFeedback, getUserFeedback, getAnalytics, createUser, getUserByEmail, getUserById, deleteFeedback } from './database.js';

const require = createRequire(import.meta.url);
const vaderSentiment = require('vader-sentiment');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// VADER sentiment analysis function
const analyzeSentiment = (text) => {
  const intensity = vaderSentiment.SentimentIntensityAnalyzer.polarity_scores(text);
  
  let sentiment = 'Neutral';
  let score = 0.5;
  
  // VADER returns compound score from -1 (most negative) to +1 (most positive)
  if (intensity.compound >= 0.05) {
    sentiment = 'Positive';
    score = (intensity.compound + 1) / 2; // Convert to 0-1 scale
  } else if (intensity.compound <= -0.05) {
    sentiment = 'Negative';
    score = (intensity.compound + 1) / 2; // Convert to 0-1 scale
  } else {
    sentiment = 'Neutral';
    score = 0.5;
  }
  
  return { 
    sentiment, 
    score, 
    confidence: Math.abs(intensity.compound), 
    method: 'VADER',
    details: {
      positive: intensity.pos,
      neutral: intensity.neu,
      negative: intensity.neg,
      compound: intensity.compound
    }
  };
};

// Routes
app.post('/api/feedback', async (req, res) => {
  try {
    const { message, user_id } = req.body;
    
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }
    
    const sentimentResult = analyzeSentiment(message);
    
    const feedback = await insertFeedback({
      user_id: user_id || null,
      message,
      sentiment: sentimentResult.sentiment,
      sentiment_score: sentimentResult.score
    });
    
    res.json({ 
      feedback,
      sentiment: sentimentResult
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/feedback', async (req, res) => {
  try {
    const { user_id } = req.query;
    
    let feedback;
    if (user_id) {
      feedback = await getUserFeedback(user_id);
    } else {
      feedback = await getAllFeedback();
    }
    
    res.json(feedback);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/analytics', async (req, res) => {
  try {
    const analytics = await getAnalytics();
    res.json(analytics);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/sentiment', (req, res) => {
  try {
    const { text } = req.body;
    
    if (!text) {
      return res.status(400).json({ error: 'Text is required' });
    }
    
    const result = analyzeSentiment(text);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Auth routes
app.post('/api/auth/signup', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }
    
    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }
    
    const user = await createUser({ email, password });
    res.json({ user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/auth/signin', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }
    
    const user = await getUserByEmail(email);
    if (!user || user.password !== password) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    res.json({ user: { id: user.id, email: user.email, role: user.role } });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/auth/user/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const user = await getUserById(id);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json({ user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/feedback/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await deleteFeedback(id);
    
    if (!result.deleted) {
      return res.status(404).json({ error: 'Feedback not found' });
    }
    
    res.json({ message: 'Feedback deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});