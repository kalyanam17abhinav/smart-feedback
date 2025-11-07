import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { feedbackText, category } = await req.json();

    if (!feedbackText || feedbackText.trim().length === 0) {
      return new Response(
        JSON.stringify({ error: 'Feedback text is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Analyzing feedback:', feedbackText.substring(0, 50) + '...');

    const SYNTHETIC_API_KEY = Deno.env.get('SYNTHETIC_API_KEY');
    if (!SYNTHETIC_API_KEY) {
      console.error('SYNTHETIC_API_KEY not configured');
      throw new Error('AI service not configured');
    }

    const aiResponse = await fetch('https://ai.gateway.synthetic.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${SYNTHETIC_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          {
            role: 'system',
            content: 'You are a sentiment analysis expert. Analyze the given feedback and respond with ONLY a JSON object in this exact format: {"sentiment": "positive|neutral|negative", "score": 0.XX, "reasoning": "brief explanation"}. The score should be between 0.00 and 1.00, where values closer to 1.00 indicate stronger sentiment.'
          },
          {
            role: 'user',
            content: `Analyze this feedback: "${feedbackText}"`
          }
        ],
      }),
    });

    if (!aiResponse.ok) {
      const errorText = await aiResponse.text();
      console.error('AI API error:', aiResponse.status, errorText);
      
      if (aiResponse.status === 429) {
        return new Response(
          JSON.stringify({ error: 'Rate limit exceeded. Please try again later.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      if (aiResponse.status === 402) {
        return new Response(
          JSON.stringify({ error: 'AI service requires payment. Please contact support.' }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      throw new Error('AI analysis failed');
    }

    const aiData = await aiResponse.json();
    const aiContent = aiData.choices[0].message.content;
    console.log('AI response:', aiContent);

    // Parse AI response
    let sentimentResult;
    try {
      sentimentResult = JSON.parse(aiContent);
    } catch (e) {
      console.error('Failed to parse AI response:', e);
      // Fallback: extract sentiment from text
      const lowerContent = aiContent.toLowerCase();
      if (lowerContent.includes('positive')) {
        sentimentResult = { sentiment: 'positive', score: 0.75, reasoning: 'Analyzed as positive' };
      } else if (lowerContent.includes('negative')) {
        sentimentResult = { sentiment: 'negative', score: 0.75, reasoning: 'Analyzed as negative' };
      } else {
        sentimentResult = { sentiment: 'neutral', score: 0.50, reasoning: 'Analyzed as neutral' };
      }
    }

    // Get user ID from authorization header if present
    const authHeader = req.headers.get('authorization');
    let userId = null;
    
    if (authHeader) {
      const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
      const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY')!;
      const supabase = createClient(supabaseUrl, supabaseKey, {
        global: {
          headers: { Authorization: authHeader },
        },
      });

      const { data: { user } } = await supabase.auth.getUser();
      userId = user?.id || null;
    }

    // Store in database
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { data, error } = await supabase
      .from('feedback')
      .insert({
        user_id: userId,
        feedback_text: feedbackText,
        sentiment: sentimentResult.sentiment,
        sentiment_score: sentimentResult.score,
        category: category || null,
      })
      .select()
      .single();

    if (error) {
      console.error('Database error:', error);
      throw error;
    }

    console.log('Feedback stored successfully:', data.id);

    return new Response(
      JSON.stringify({
        id: data.id,
        sentiment: sentimentResult.sentiment,
        score: sentimentResult.score,
        reasoning: sentimentResult.reasoning,
        created_at: data.created_at,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error in analyze-feedback:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});