import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { corsHeaders } from '../_shared/cors.ts'

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { message } = await req.json()

    if (!message) {
      return new Response(
        JSON.stringify({ error: 'Message is required' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // TextBlob-like sentiment analysis
    const textBlobResult = await analyzeWithTextBlob(message)
    
    // VADER-like sentiment analysis
    const vaderResult = await analyzeWithVADER(message)

    // Combine results for more accurate sentiment
    const finalSentiment = combineSentiments(textBlobResult, vaderResult)

    return new Response(
      JSON.stringify({
        message,
        textblob: textBlobResult,
        vader: vaderResult,
        final: finalSentiment
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})

async function analyzeWithTextBlob(text: string) {
  const positiveWords = ['good', 'great', 'excellent', 'amazing', 'wonderful', 'fantastic', 'love', 'like', 'best', 'awesome', 'perfect', 'happy', 'satisfied', 'pleased']
  const negativeWords = ['bad', 'terrible', 'awful', 'horrible', 'hate', 'dislike', 'worst', 'poor', 'disappointed', 'angry', 'frustrated', 'sad', 'unhappy']
  
  const words = text.toLowerCase().split(/\W+/)
  let score = 0
  
  words.forEach(word => {
    if (positiveWords.includes(word)) score += 1
    if (negativeWords.includes(word)) score -= 1
  })
  
  const polarity = Math.max(-1, Math.min(1, score / words.length * 10))
  
  return {
    polarity,
    sentiment: polarity > 0.1 ? 'Positive' : polarity < -0.1 ? 'Negative' : 'Neutral',
    confidence: Math.abs(polarity)
  }
}

async function analyzeWithVADER(text: string) {
  const intensifiers = ['very', 'really', 'extremely', 'incredibly', 'absolutely']
  const negations = ['not', 'no', 'never', 'nothing', 'nowhere', 'neither', 'nobody', 'none']
  
  const words = text.toLowerCase().split(/\W+/)
  let compound = 0
  let positive = 0
  let negative = 0
  let neutral = 0
  
  for (let i = 0; i < words.length; i++) {
    const word = words[i]
    let wordScore = getWordScore(word)
    
    if (i > 0 && intensifiers.includes(words[i-1])) {
      wordScore *= 1.5
    }
    
    if (i > 0 && negations.includes(words[i-1])) {
      wordScore *= -1
    }
    
    compound += wordScore
    
    if (wordScore > 0) positive += wordScore
    else if (wordScore < 0) negative += Math.abs(wordScore)
    else neutral += 1
  }
  
  const total = positive + negative + neutral
  compound = compound / Math.sqrt(words.length)
  
  return {
    compound: Math.max(-1, Math.min(1, compound)),
    positive: total > 0 ? positive / total : 0,
    negative: total > 0 ? negative / total : 0,
    neutral: total > 0 ? neutral / total : 0,
    sentiment: compound >= 0.05 ? 'Positive' : compound <= -0.05 ? 'Negative' : 'Neutral'
  }
}

function getWordScore(word: string): number {
  const scores: { [key: string]: number } = {
    'excellent': 0.8, 'amazing': 0.7, 'wonderful': 0.6, 'fantastic': 0.7,
    'great': 0.5, 'good': 0.4, 'nice': 0.3, 'love': 0.6, 'like': 0.3,
    'best': 0.6, 'awesome': 0.7, 'perfect': 0.8, 'happy': 0.5,
    'satisfied': 0.4, 'pleased': 0.4, 'enjoy': 0.4, 'recommend': 0.3,
    
    'terrible': -0.8, 'awful': -0.7, 'horrible': -0.7, 'bad': -0.5,
    'poor': -0.4, 'hate': -0.6, 'dislike': -0.4, 'worst': -0.7,
    'disappointed': -0.5, 'angry': -0.6, 'frustrated': -0.5, 'sad': -0.4,
    'unhappy': -0.5, 'annoying': -0.4, 'boring': -0.3, 'slow': -0.2
  }
  
  return scores[word] || 0
}

function combineSentiments(textBlob: any, vader: any) {
  const textBlobWeight = 0.4
  const vaderWeight = 0.6
  
  const combinedScore = (textBlob.polarity * textBlobWeight) + (vader.compound * vaderWeight)
  
  let sentiment = 'Neutral'
  if (combinedScore > 0.1) sentiment = 'Positive'
  else if (combinedScore < -0.1) sentiment = 'Negative'
  
  return {
    score: combinedScore,
    sentiment,
    confidence: Math.abs(combinedScore),
    method: 'Combined TextBlob + VADER'
  }
}