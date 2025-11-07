// Simple sentiment analysis implementation
export interface SentimentResult {
  sentiment: 'Positive' | 'Negative' | 'Neutral';
  score: number;
}

export function analyzeSentiment(message: string): SentimentResult {
  const positiveWords = ['good', 'great', 'excellent', 'amazing', 'love', 'like', 'awesome', 'fantastic', 'wonderful', 'perfect', 'best', 'happy', 'satisfied'];
  const negativeWords = ['bad', 'terrible', 'awful', 'hate', 'dislike', 'horrible', 'worst', 'disappointed', 'angry', 'frustrated', 'poor', 'sad'];
  
  const words = message.toLowerCase().split(/\s+/);
  let score = 0;
  
  words.forEach(word => {
    if (positiveWords.includes(word)) score += 1;
    if (negativeWords.includes(word)) score -= 1;
  });
  
  let sentiment: 'Positive' | 'Negative' | 'Neutral';
  if (score > 0) sentiment = 'Positive';
  else if (score < 0) sentiment = 'Negative';
  else sentiment = 'Neutral';
  
  return { sentiment, score };
}