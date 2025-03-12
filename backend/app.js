const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

// Initialize express app
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Connect to SQLite database
const db = new sqlite3.Database('./students.db', (err) => {
  if (err) {
    console.error('Error connecting to database:', err.message);
  } else {
    console.log('Connected to the students database.');
    
    // Create students table if it doesn't exist
    db.run(`CREATE TABLE IF NOT EXISTS students (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      firstName TEXT NOT NULL,
      lastName TEXT NOT NULL,
      idNumber TEXT NOT NULL UNIQUE,
      registrationNumber TEXT NOT NULL UNIQUE,
      course TEXT NOT NULL,
      registrationDate TEXT NOT NULL
    )`, (err) => {
      if (err) {
        console.error('Error creating table:', err.message);
      } else {
        console.log('Students table ready');
      }
    });
  }
});

// API Routes

// Get all students
app.get('/api/students', (req, res) => {
  db.all('SELECT * FROM students ORDER BY id DESC', [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ students: rows });
  });
});

// Get a single student
app.get('/api/students/:id', (req, res) => {
  db.get('SELECT * FROM students WHERE id = ?', [req.params.id], (err, row) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (!row) {
      res.status(404).json({ error: 'Student not found' });
      return;
    }
    res.json({ student: row });
  });
});

// Create a new student
app.post('/api/students', (req, res) => {
  const { firstName, lastName, idNumber, registrationNumber, course, registrationDate } = req.body;
  
  if (!firstName || !lastName || !idNumber || !registrationNumber || !course || !registrationDate) {
    res.status(400).json({ error: 'All fields are required' });
    return;
  }

  db.run(
    `INSERT INTO students (firstName, lastName, idNumber, registrationNumber, course, registrationDate) 
     VALUES (?, ?, ?, ?, ?, ?)`,
    [firstName, lastName, idNumber, registrationNumber, course, registrationDate],
    function(err) {
      if (err) {
        if (err.message.includes('UNIQUE constraint failed')) {
          res.status(400).json({ error: 'ID Number or Registration Number already exists' });
        } else {
          res.status(500).json({ error: err.message });
        }
        return;
      }
      
      res.status(201).json({ 
        message: 'Student created successfully',
        id: this.lastID 
      });
    }
  );
});

// Update a student
app.put('/api/students/:id', (req, res) => {
  const { firstName, lastName, idNumber, registrationNumber, course, registrationDate } = req.body;
  
  if (!firstName || !lastName || !idNumber || !registrationNumber || !course || !registrationDate) {
    res.status(400).json({ error: 'All fields are required' });
    return;
  }

  db.run(
    `UPDATE students SET 
      firstName = ?, 
      lastName = ?, 
      idNumber = ?, 
      registrationNumber = ?, 
      course = ?, 
      registrationDate = ?
     WHERE id = ?`,
    [firstName, lastName, idNumber, registrationNumber, course, registrationDate, req.params.id],
    function(err) {
      if (err) {
        if (err.message.includes('UNIQUE constraint failed')) {
          res.status(400).json({ error: 'ID Number or Registration Number already exists' });
        } else {
          res.status(500).json({ error: err.message });
        }
        return;
      }
      
      if (this.changes === 0) {
        res.status(404).json({ error: 'Student not found' });
        return;
      }
      
      res.json({ message: 'Student updated successfully' });
    }
  );
});

// Delete a student
app.delete('/api/students/:id', (req, res) => {
  db.run('DELETE FROM students WHERE id = ?', [req.params.id], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    
    if (this.changes === 0) {
      res.status(404).json({ error: 'Student not found' });
      return;
    }
    
    res.json({ message: 'Student deleted successfully' });
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});