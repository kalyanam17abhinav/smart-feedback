# Smart Feedback Collection and Analysis System

## Project Objective
Develop a standalone web application for collecting user feedback and performing real-time sentiment analysis to help organizations understand customer opinions and improve their services.

## Description
A full-stack application that allows users to submit feedback through a responsive web interface. The system automatically analyzes the sentiment of each feedback using VADER sentiment analysis and provides analytics dashboards for administrators to view sentiment trends and manage feedback data.

## Installation and Running Steps

### Prerequisites
- Node.js 18+ and npm

### Installation
```bash
# Clone the repository
cd smartfeedback-main

# Install frontend dependencies
npm install

# Install backend dependencies
npm run server:install
```

### Running the Application
```bash
# Start both frontend and backend
npm run start:all

# Access the application
# Frontend: http://localhost:5173
# Backend API: http://localhost:3001
```

## Tech Stack

**Frontend:**
- React 18 + TypeScript
- Vite
- Tailwind CSS + shadcn/ui
- Chart.js

**Backend:**
- Express.js
- SQLite3
- VADER Sentiment Analysis