import React from 'react';

function StudentList({ students, editStudent, deleteStudent }) {
  if (students.length === 0) {
    return <div className="no-students">No students found. Add a student to get started.</div>;
  }

  return (
    <div className="student-list">
      <h2>Student Records</h2>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>ID Number</th>
            <th>Registration Number</th>
            <th>Course</th>
            <th>Registration Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {students.map((student) => (
            <tr key={student.id}>
              <td>{student.firstName} {student.lastName}</td>
              <td>{student.idNumber}</td>
              <td>{student.registrationNumber}</td>
              <td>{student.course}</td>
              <td>{new Date(student.registrationDate).toLocaleDateString()}</td>
              <td className="actions">
                <button 
                  className="edit-btn" 
                  onClick={() => editStudent(student)}
                >
                  Edit
                </button>
                <button 
                  className="delete-btn" 
                  onClick={() => deleteStudent(student.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default StudentList;