# Smart Feedback Collection and Analysis System

A full-stack application for collecting user feedback and performing real-time sentiment analysis.

## Project Structure

```
smartfeedback-main/
├── frontend/          # React + TypeScript frontend
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── ...
├── backend/           # Supabase backend
│   ├── supabase/
│   ├── .env
│   ├── package.json
│   └── ...
└── README.md
```

## Features

- **User Authentication** with role-based access (Guest, User, Admin)
- **Feedback Submission** with real-time sentiment analysis
- **Admin Dashboard** for managing all feedback
- **Analytics & Visualizations** with charts and statistics
- **Responsive Design** for all devices
- **Modern UI** with dark theme and animations

## Quick Start

### Frontend Setup
cd frontend
npm install
cp .env.example .env
# Edit .env with your Supabase credentials
npm run dev

### Backend Setup
cd backend
npm install
cp .env.example .env
# Edit .env with your Supabase credentials
npm run start

## Tech Stack

**Frontend:**
- React 18 + TypeScript
- Vite
- Tailwind CSS + shadcn/ui
- Framer Motion
- Chart.js

**Backend:**
- Supabase (Database + Auth + Functions)
- PostgreSQL
- Row Level Security (RLS)

## Database Schema

**Users:** Managed by Supabase Auth
**Feedback:** id, user_id, message, sentiment, sentiment_score, timestamp

## API Endpoints

- `POST /api/feedback` - Submit feedback
- `GET /api/summary` - Get sentiment summary
- `GET /api/analytics` - Get analytics data

## Deployment

**Frontend:** Deploy to Vercel, Netlify, or any static hosting
**Backend:** Supabase handles hosting automatically