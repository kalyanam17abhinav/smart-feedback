-- Drop existing tables if they exist
DROP TABLE IF EXISTS public.feedback CASCADE;
DROP TABLE IF EXISTS public.users CASCADE;

-- Create feedback table with simple structure
CREATE TABLE public.feedback (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  message TEXT NOT NULL,
  sentiment TEXT NOT NULL CHECK (sentiment IN ('Positive', 'Neutral', 'Negative')),
  sentiment_score DECIMAL(3,2),
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.feedback ENABLE ROW LEVEL SECURITY;

-- Simple policies
CREATE POLICY "Anyone can insert feedback"
  ON public.feedback
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Users can view own feedback"
  ON public.feedback
  FOR SELECT
  USING (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Anyone can view all feedback"
  ON public.feedback
  FOR SELECT
  USING (true);

-- Create indexes
CREATE INDEX idx_feedback_sentiment ON public.feedback(sentiment);
CREATE INDEX idx_feedback_timestamp ON public.feedback(timestamp DESC);
CREATE INDEX idx_feedback_user_id ON public.feedback(user_id) WHERE user_id IS NOT NULL;