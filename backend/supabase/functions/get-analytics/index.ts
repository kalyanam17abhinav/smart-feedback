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
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get sentiment distribution
    const { data: allFeedback, error: fetchError } = await supabase
      .from('feedback')
      .select('sentiment, created_at, category')
      .order('created_at', { ascending: false });

    if (fetchError) {
      console.error('Database error:', fetchError);
      throw fetchError;
    }

    // Calculate sentiment counts
    const sentimentCounts = {
      positive: 0,
      neutral: 0,
      negative: 0,
    };

    const categoryDistribution: Record<string, number> = {};
    const dailyTrends: Record<string, { positive: number; neutral: number; negative: number }> = {};

    allFeedback?.forEach((item) => {
      // Sentiment counts
      if (item.sentiment in sentimentCounts) {
        sentimentCounts[item.sentiment as keyof typeof sentimentCounts]++;
      }

      // Category distribution
      if (item.category) {
        categoryDistribution[item.category] = (categoryDistribution[item.category] || 0) + 1;
      }

      // Daily trends (last 7 days)
      const date = new Date(item.created_at).toISOString().split('T')[0];
      if (!dailyTrends[date]) {
        dailyTrends[date] = { positive: 0, neutral: 0, negative: 0 };
      }
      if (item.sentiment in dailyTrends[date]) {
        dailyTrends[date][item.sentiment as keyof typeof dailyTrends[string]]++;
      }
    });

    const total = sentimentCounts.positive + sentimentCounts.neutral + sentimentCounts.negative;

    // Format daily trends for chart
    const trendData = Object.entries(dailyTrends)
      .sort(([a], [b]) => a.localeCompare(b))
      .slice(-7) // Last 7 days
      .map(([date, counts]) => ({
        date,
        ...counts,
      }));

    console.log(`Analytics summary: Total feedback: ${total}`);

    return new Response(
      JSON.stringify({
        total,
        sentimentCounts,
        sentimentPercentages: {
          positive: total > 0 ? ((sentimentCounts.positive / total) * 100).toFixed(1) : 0,
          neutral: total > 0 ? ((sentimentCounts.neutral / total) * 100).toFixed(1) : 0,
          negative: total > 0 ? ((sentimentCounts.negative / total) * 100).toFixed(1) : 0,
        },
        categoryDistribution,
        dailyTrends: trendData,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error in get-analytics:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});