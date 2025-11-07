-- Create users table for additional user info
CREATE TABLE public.users (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  auth_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT,
  email TEXT,
  role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('guest', 'user', 'admin')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create feedback table
CREATE TABLE public.feedback (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  message TEXT NOT NULL,
  sentiment TEXT NOT NULL CHECK (sentiment IN ('Positive', 'Neutral', 'Negative')),
  sentiment_score DECIMAL(3,2),
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.feedback ENABLE ROW LEVEL SECURITY;

-- Policies for users table
CREATE POLICY "Users can view own profile"
  ON public.users
  FOR SELECT
  USING (auth.uid() = auth_id);

CREATE POLICY "Users can insert own profile"
  ON public.users
  FOR INSERT
  WITH CHECK (auth.uid() = auth_id);

-- Policies for feedback table
CREATE POLICY "Anyone can insert feedback"
  ON public.feedback
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Users can view own feedback"
  ON public.feedback
  FOR SELECT
  USING (user_id IN (SELECT id FROM public.users WHERE auth_id = auth.uid()) OR user_id IS NULL);

CREATE POLICY "Admins can view all feedback"
  ON public.feedback
  FOR SELECT
  USING (EXISTS (SELECT 1 FROM public.users WHERE auth_id = auth.uid() AND role = 'admin'));

-- Create indexes
CREATE INDEX idx_users_auth_id ON public.users(auth_id);
CREATE INDEX idx_feedback_sentiment ON public.feedback(sentiment);
CREATE INDEX idx_feedback_timestamp ON public.feedback(timestamp DESC);
CREATE INDEX idx_feedback_user_id ON public.feedback(user_id) WHERE user_id IS NOT NULL;