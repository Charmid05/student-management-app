import React, { useState, useEffect } from 'react';
import './App.css';
import StudentForm from './components/StudentForm';
import StudentList from './components/StudentList';
import StudentPrint from './components/StudentPrint';

function App() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentStudent, setCurrentStudent] = useState(null);
  const [isPrintView, setIsPrintView] = useState(false);
  
  const API_URL = 'http://localhost:5000/api';

  // Fetch all students
  const fetchStudents = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/students`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch students');
      }
      
      const data = await response.json();
      setStudents(data.students);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Load students on component mount
  useEffect(() => {
    fetchStudents();
  }, []);

  // Add a new student
  const addStudent = async (student) => {
    try {
      const response = await fetch(`${API_URL}/students`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(student),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to add student');
      }
      
      fetchStudents();
    } catch (err) {
      setError(err.message);
    }
  };

  // Update a student
  const updateStudent = async (id, student) => {
    try {
      const response = await fetch(`${API_URL}/students/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(student),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update student');
      }
      
      fetchStudents();
      setCurrentStudent(null);
    } catch (err) {
      setError(err.message);
    }
  };

  // Delete a student
  const deleteStudent = async (id) => {
    if (window.confirm('Are you sure you want to delete this student?')) {
      try {
        const response = await fetch(`${API_URL}/students/${id}`, {
          method: 'DELETE',
        });
        
        if (!response.ok) {
          throw new Error('Failed to delete student');
        }
        
        fetchStudents();
      } catch (err) {
        setError(err.message);
      }
    }
  };

  // Set current student for editing
  const editStudent = (student) => {
    setCurrentStudent(student);
  };

  // Toggle print view
  const togglePrintView = () => {
    setIsPrintView(!isPrintView);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Student Management System</h1>
        <button className="print-button" onClick={togglePrintView}>
          {isPrintView ? 'Exit Print View' : 'Print Students'}
        </button>
      </header>

      {isPrintView ? (
        <StudentPrint students={students} />
      ) : (
        <div className="container">
          <div className="form-container">
            <StudentForm 
              addStudent={addStudent} 
              updateStudent={updateStudent}
              currentStudent={currentStudent}
              clearCurrentStudent={() => setCurrentStudent(null)}
            />
          </div>
          
          <div className="list-container">
            {error && <div className="error-message">{error}</div>}
            {loading ? (
              <div className="loading">Loading students...</div>
            ) : (
              <StudentList 
                students={students} 
                editStudent={editStudent} 
                deleteStudent={deleteStudent} 
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;