import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { message, user_id } = await req.json()
    
    // Simple sentiment analysis
    const analyzeSentiment = (text: string) => {
      const positiveWords = ['good', 'great', 'excellent', 'amazing', 'love', 'like', 'awesome', 'fantastic', 'wonderful', 'perfect', 'best', 'happy', 'satisfied']
      const negativeWords = ['bad', 'terrible', 'awful', 'hate', 'dislike', 'horrible', 'worst', 'disappointed', 'angry', 'frustrated', 'poor', 'sad']
      
      const words = text.toLowerCase().split(/\s+/)
      let score = 0
      
      words.forEach(word => {
        if (positiveWords.includes(word)) score += 1
        if (negativeWords.includes(word)) score -= 1
      })
      
      let sentiment: string
      if (score > 0) sentiment = 'Positive'
      else if (score < 0) sentiment = 'Negative'
      else sentiment = 'Neutral'
      
      return { sentiment, score }
    }

    const sentimentResult = analyzeSentiment(message)
    
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { data, error } = await supabase
      .from('feedback')
      .insert({
        user_id,
        message,
        sentiment: sentimentResult.sentiment,
        sentiment_score: sentimentResult.score
      })
      .select()

    if (error) throw error

    return new Response(
      JSON.stringify({ 
        success: true, 
        sentiment: sentimentResult.sentiment,
        score: sentimentResult.score,
        data 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      },
    )
  }
})