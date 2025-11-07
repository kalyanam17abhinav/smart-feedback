# Smart Feedback Backend

This is the backend for the Smart Feedback Collection and Analysis System using Supabase Cloud.

## Cloud Setup

Backend is already configured and running on Supabase Cloud:
- **URL**: https://zddaopimuxozqaictllz.supabase.co
- **Database**: PostgreSQL with RLS policies
- **Authentication**: Supabase Auth

## Database

- **Tables**: `feedback` table with sentiment analysis
- **Authentication**: Supabase Auth with user roles
- **Functions**: Edge functions for API endpoints

## Environment Variables

Create `.env` file with:
```
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

## API Endpoints

- `POST /api/feedback` - Submit feedback
- `GET /api/summary` - Get sentiment summary
- `GET /api/analytics` - Get analytics data