# Smart Feedback Collection and Analysis System

A standalone full-stack application for collecting user feedback and performing real-time sentiment analysis with SQLite database.

## Project Structure

```
smartfeedback-main/
├── src/                    # React + TypeScript frontend
│   ├── components/         # UI components
│   ├── pages/             # Application pages
│   ├── lib/               # Utility functions and API client
│   └── hooks/             # Custom React hooks
├── server/                # Express.js backend
│   ├── database.js        # SQLite database layer
│   ├── server.js          # Express server
│   └── package.json       # Server dependencies
├── public/                # Static assets
├── package.json           # Frontend dependencies and scripts
└── README.md
```

## Features

- **Feedback Submission** with real-time sentiment analysis
- **Admin Dashboard** for viewing all feedback
- **Analytics & Visualizations** with charts and statistics
- **Responsive Design** for all devices
- **Modern UI** with clean light theme
- **Standalone SQLite Database** - no external dependencies
- **Cross-device Data Sharing** - common database accessible from any device

## Quick Start

### Prerequisites
- Node.js 18+ and npm

### Setup Instructions

1. **Clone and Install**
   ```bash
   git clone <repository-url>
   cd smartfeedback-main
   npm install
   npm run server:install
   ```

2. **Start the Application**
   ```bash
   # Start both frontend and backend together
   npm run start:all
   
   # Or start them separately:
   # Terminal 1 - Backend server
   npm run server:dev
   
   # Terminal 2 - Frontend
   npm run dev
   ```

3. **Access the Application**
   - Frontend: `http://localhost:5173`
   - Backend API: `http://localhost:3001`

## Tech Stack

**Frontend:**
- React 18 + TypeScript
- Vite
- Tailwind CSS + shadcn/ui
- Framer Motion
- Chart.js

**Backend:**
- Express.js
- SQLite3
- Simple keyword-based sentiment analysis

## Database Schema

**Feedback Table:**
- id (TEXT PRIMARY KEY)
- user_id (TEXT) - Simple session-based user identification
- message (TEXT NOT NULL)
- sentiment (TEXT) - 'Positive', 'Neutral', or 'Negative'
- sentiment_score (REAL) - Confidence score (0-1)
- timestamp (DATETIME) - Auto-generated

## API Endpoints

- `POST /api/feedback` - Submit feedback with sentiment analysis
- `GET /api/feedback` - Get all feedback or user-specific feedback
- `GET /api/analytics` - Get sentiment analytics
- `POST /api/sentiment` - Analyze sentiment of text

## Key Changes Made

### 1. Theme Changes
- Converted from dark theme to clean light theme
- Removed gold color accents
- Used minimal gray color palette
- Simplified visual elements

### 2. Database Migration
- Replaced Supabase with SQLite
- Created Express.js backend server
- Implemented simple API layer
- Added basic sentiment analysis

### 3. Standalone Architecture
- Removed authentication system
- Uses simple session-based user identification
- SQLite database file shared across all instances
- No external service dependencies

## Deployment

### Local Development
```bash
npm run start:all
```

### Production Deployment
1. Build frontend: `npm run build`
2. Deploy `dist/` folder to static hosting
3. Deploy `server/` folder to Node.js hosting
4. Ensure SQLite database file is persistent

### Network Access
To access from other devices on the same network:
1. Update API_BASE_URL in `src/lib/api.ts` to use your machine's IP
2. Start server with: `node server.js`
3. Access from other devices using your machine's IP address

## Database Location
The SQLite database file (`feedback.db`) is created in the `server/` directory and contains all feedback data that can be accessed from any device running the application.

## Migration Notes

If you're migrating from the original Supabase version:

1. **Data Export**: Export your existing feedback data from Supabase
2. **Data Import**: Use the SQLite database structure to import your data
3. **Remove Dependencies**: The new version doesn't require Supabase account or configuration
4. **Update Environment**: No environment variables needed for basic functionality