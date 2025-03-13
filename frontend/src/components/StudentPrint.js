import React, { useEffect } from 'react';

function StudentPrint({ students }) {
  // Set up print functionality
  useEffect(() => {
    const timeout = setTimeout(() => {
      window.print();
    }, 500);
    
    return () => clearTimeout(timeout);
  }, []);

  return (
    <div className="print-view">
      <h2>Student Records</h2>
      <p className="print-date">Printed on: {new Date().toLocaleDateString()}</p>
      
      <table className="print-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>ID Number</th>
            <th>Registration Number</th>
            <th>Course</th>
            <th>Registration Date</th>
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
            </tr>
          ))}
        </tbody>
      </table>
      
      <div className="print-footer">
        <p>Total Students: {students.length}</p>
      </div>
    </div>
  );
}

export default StudentPrint;