import React, { useState, useEffect } from 'react';

function StudentForm({ addStudent, updateStudent, currentStudent, clearCurrentStudent }) {
  const initialFormState = {
    firstName: '',
    lastName: '',
    idNumber: '',
    registrationNumber: '',
    course: '',
    registrationDate: new Date().toISOString().slice(0, 10)
  };

  const [student, setStudent] = useState(initialFormState);

  // Update form when currentStudent changes (for editing)
  useEffect(() => {
    if (currentStudent) {
      setStudent({
        ...currentStudent,
        registrationDate: currentStudent.registrationDate.slice(0, 10)
      });
    } else {
      setStudent(initialFormState);
    }
  }, [currentStudent]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setStudent({ ...student, [name]: value });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    
    // Validate form
    if (!student.firstName || !student.lastName || !student.idNumber || 
        !student.registrationNumber || !student.course || !student.registrationDate) {
      alert('All fields are required!');
      return;
    }
    
    if (currentStudent) {
      updateStudent(currentStudent.id, student);
    } else {
      addStudent(student);
    }
    
    setStudent(initialFormState);
  };

  const cancelEdit = () => {
    clearCurrentStudent();
    setStudent(initialFormState);
  };

  return (
    <div className="form-wrapper">
      <h2>{currentStudent ? 'Edit Student' : 'Add New Student'}</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>First Name</label>
          <input
            type="text"
            name="firstName"
            value={student.firstName}
            onChange={handleInputChange}
            placeholder="Enter first name"
            required
          />
        </div>
        
        <div className="form-group">
          <label>Last Name</label>
          <input
            type="text"
            name="lastName"
            value={student.lastName}
            onChange={handleInputChange}
            placeholder="Enter last name"
            required
          />
        </div>
        
        <div className="form-group">
          <label>ID Number</label>
          <input
            type="text"
            name="idNumber"
            value={student.idNumber}
            onChange={handleInputChange}
            placeholder="Enter ID number"
            required
          />
        </div>
        
        <div className="form-group">
          <label>Registration Number</label>
          <input
            type="text"
            name="registrationNumber"
            value={student.registrationNumber}
            onChange={handleInputChange}
            placeholder="Enter registration number"
            required
          />
        </div>
        
        <div className="form-group">
          <label>Course</label>
          <input
            type="text"
            name="course"
            value={student.course}
            onChange={handleInputChange}
            placeholder="Enter course"
            required
          />
        </div>
        
        <div className="form-group">
          <label>Registration Date</label>
          <input
            type="date"
            name="registrationDate"
            value={student.registrationDate}
            onChange={handleInputChange}
            required
          />
        </div>
        
        <div className="form-buttons">
          <button type="submit" className="submit-btn">
            {currentStudent ? 'Update Student' : 'Add Student'}
          </button>
          
          {currentStudent && (
            <button 
              type="button" 
              className="cancel-btn" 
              onClick={cancelEdit}
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

export default StudentForm;