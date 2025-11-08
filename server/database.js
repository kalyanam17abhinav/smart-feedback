import sqlite3 from 'sqlite3';
import { v4 as uuidv4 } from 'uuid';

const db = new sqlite3.Database('./feedback.db');

// Initialize database
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin')),
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
  
  db.run(`
    CREATE TABLE IF NOT EXISTS feedback (
      id TEXT PRIMARY KEY,
      user_id TEXT,
      message TEXT NOT NULL,
      sentiment TEXT NOT NULL CHECK (sentiment IN ('Positive', 'Neutral', 'Negative')),
      sentiment_score REAL,
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users (id)
    )
  `);
  
  // Insert admin user if not exists
  db.run(`
    INSERT OR IGNORE INTO users (id, email, password, role) 
    VALUES ('admin-001', 'admin@smartfeedback.com', 'admin123', 'admin')
  `);
});

export const insertFeedback = (feedbackData) => {
  return new Promise((resolve, reject) => {
    const { user_id, message, sentiment, sentiment_score } = feedbackData;
    const id = uuidv4();
    
    db.run(
      'INSERT INTO feedback (id, user_id, message, sentiment, sentiment_score) VALUES (?, ?, ?, ?, ?)',
      [id, user_id, message, sentiment, sentiment_score],
      function(err) {
        if (err) reject(err);
        else resolve({ id, ...feedbackData });
      }
    );
  });
};

export const getAllFeedback = () => {
  return new Promise((resolve, reject) => {
    db.all('SELECT * FROM feedback ORDER BY timestamp DESC', (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
};

export const getUserFeedback = (userId) => {
  return new Promise((resolve, reject) => {
    db.all('SELECT * FROM feedback WHERE user_id = ? ORDER BY timestamp DESC', [userId], (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
};

export const getAnalytics = () => {
  return new Promise((resolve, reject) => {
    db.all(`
      SELECT 
        sentiment,
        COUNT(*) as count,
        AVG(sentiment_score) as avg_score
      FROM feedback 
      GROUP BY sentiment
    `, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
};

export const createUser = (userData) => {
  return new Promise((resolve, reject) => {
    const { email, password } = userData;
    const id = uuidv4();
    
    db.run(
      'INSERT INTO users (id, email, password) VALUES (?, ?, ?)',
      [id, email, password],
      function(err) {
        if (err) reject(err);
        else resolve({ id, email, role: 'user' });
      }
    );
  });
};

export const getUserByEmail = (email) => {
  return new Promise((resolve, reject) => {
    db.get('SELECT * FROM users WHERE email = ?', [email], (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
};

export const getUserById = (id) => {
  return new Promise((resolve, reject) => {
    db.get('SELECT id, email, role FROM users WHERE id = ?', [id], (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
};

export const deleteFeedback = (id) => {
  return new Promise((resolve, reject) => {
    db.run('DELETE FROM feedback WHERE id = ?', [id], function(err) {
      if (err) reject(err);
      else resolve({ deleted: this.changes > 0 });
    });
  });
};

export default db;