-- Add user_metadata column to store roles
-- We'll use Supabase auth.users metadata for roles

-- Create a function to check if user is admin
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN (auth.jwt() ->> 'user_metadata')::jsonb ->> 'role' = 'admin';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Update feedback policies to restrict admin access
DROP POLICY IF EXISTS "Anyone can view all feedback" ON public.feedback;

CREATE POLICY "Admins can view all feedback"
  ON public.feedback
  FOR SELECT
  USING (is_admin() OR auth.uid() = user_id OR user_id IS NULL);