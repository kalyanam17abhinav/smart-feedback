const API_BASE_URL = 'http://localhost:3001/api';

export interface Feedback {
  id: string;
  user_id?: string;
  message: string;
  sentiment: 'Positive' | 'Neutral' | 'Negative';
  sentiment_score: number;
  timestamp: string;
}

export interface SentimentResult {
  sentiment: string;
  score: number;
  confidence: number;
  method: string;
}

export const submitFeedback = async (message: string, userId?: string): Promise<{ feedback: Feedback; sentiment: SentimentResult }> => {
  const response = await fetch(`${API_BASE_URL}/feedback`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ message, user_id: userId }),
  });

  if (!response.ok) {
    throw new Error('Failed to submit feedback');
  }

  return response.json();
};

export const getFeedback = async (userId?: string): Promise<Feedback[]> => {
  const url = userId ? `${API_BASE_URL}/feedback?user_id=${userId}` : `${API_BASE_URL}/feedback`;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error('Failed to fetch feedback');
  }

  return response.json();
};

export const getAnalytics = async (): Promise<Array<{ sentiment: string; count: number; avg_score: number }>> => {
  const response = await fetch(`${API_BASE_URL}/analytics`);

  if (!response.ok) {
    throw new Error('Failed to fetch analytics');
  }

  return response.json();
};

export const analyzeSentiment = async (text: string): Promise<SentimentResult> => {
  const response = await fetch(`${API_BASE_URL}/sentiment`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ text }),
  });

  if (!response.ok) {
    throw new Error('Failed to analyze sentiment');
  }

  return response.json();
};

export interface User {
  id: string;
  email: string;
  role: 'user' | 'admin';
}

export const signUp = async (email: string, password: string): Promise<{ user: User }> => {
  const response = await fetch(`${API_BASE_URL}/auth/signup`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to sign up');
  }

  return response.json();
};

export const signIn = async (email: string, password: string): Promise<{ user: User }> => {
  const response = await fetch(`${API_BASE_URL}/auth/signin`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to sign in');
  }

  return response.json();
};

export const getUser = async (userId: string): Promise<{ user: User }> => {
  const response = await fetch(`${API_BASE_URL}/auth/user/${userId}`);

  if (!response.ok) {
    throw new Error('Failed to get user');
  }

  return response.json();
};

export const deleteFeedbackById = async (feedbackId: string): Promise<{ message: string }> => {
  const response = await fetch(`${API_BASE_URL}/feedback/${feedbackId}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to delete feedback');
  }

  return response.json();
};