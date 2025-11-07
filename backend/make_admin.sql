-- Replace 'user-email@example.com' with the actual email of the user you want to make admin
UPDATE auth.users 
SET raw_user_meta_data = jsonb_set(
  COALESCE(raw_user_meta_data, '{}'), 
  '{role}', 
  '"admin"'
)
WHERE email = 'anu60709@gmail.com';

-- Check if it worked
SELECT email, raw_user_meta_data FROM auth.users WHERE email = 'anu60709@gmail.com';