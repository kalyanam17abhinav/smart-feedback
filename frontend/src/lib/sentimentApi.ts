import axios from 'axios'
import { supabase } from '../integrations/supabase/client'

export interface SentimentResult {
  sentiment: 'Positive' | 'Negative' | 'Neutral'
  score: number
  confidence: number
  method: string
}

export async function analyzeSentiment(message: string): Promise<SentimentResult> {
  try {
    const { data, error } = await supabase.functions.invoke('sentiment-analysis', {
      body: { message }
    })

    if (error) throw error

    return {
      sentiment: data.final.sentiment,
      score: data.final.score,
      confidence: data.final.confidence,
      method: data.final.method
    }
  } catch (error) {
    console.error('Sentiment analysis failed:', error)
    
    // Fallback to simple analysis
    return fallbackSentimentAnalysis(message)
  }
}

function fallbackSentimentAnalysis(text: string): SentimentResult {
  const positiveWords = ['good', 'great', 'excellent', 'amazing', 'love', 'like', 'best', 'awesome', 'perfect', 'happy']
  const negativeWords = ['bad', 'terrible', 'awful', 'horrible', 'hate', 'dislike', 'worst', 'poor', 'disappointed', 'angry']
  
  const words = text.toLowerCase().split(/\W+/)
  let score = 0
  
  words.forEach(word => {
    if (positiveWords.includes(word)) score += 1
    if (negativeWords.includes(word)) score -= 1
  })
  
  const normalizedScore = score / words.length
  
  return {
    sentiment: normalizedScore > 0.1 ? 'Positive' : normalizedScore < -0.1 ? 'Negative' : 'Neutral',
    score: normalizedScore,
    confidence: Math.abs(normalizedScore),
    method: 'Fallback Analysis'
  }
}