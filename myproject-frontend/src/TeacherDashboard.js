import React, { useEffect, useState } from "react";

const TeacherDashboard = () => {
    const [assignments, setAssignments] = useState([]);

    // Fetch data from the backend
    useEffect(() => {
        fetch("http://localhost:5000/api/get-submitted-assignments")
            .then(res => res.json())
            .then(data => {
                console.log("Fetched Assignments:", data); // Debugging
                setAssignments(data);
            })
            .catch(err => console.error("Error fetching assignments:", err));
    }, []);

    return (
        <div style={{ textAlign: "center", marginTop: "50px" }}>
            <h2>Teacher Dashboard</h2>

            <nav>
                <button style={buttonStyle}>View Assignments</button>
                <button style={buttonStyle}>Check Plagiarism</button>
            </nav>

            <h3>Submitted Assignments</h3>

            <table border="1" style={{ width: "80%", margin: "20px auto", borderCollapse: "collapse" }}>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Student Name</th>
                        <th>Email</th>
                        <th>Filename</th>
                        <th>Submitted At</th>
                        <th>Download</th>
                    </tr>
                </thead>
                <tbody>
                    {assignments.length > 0 ? (
                        assignments.map((assignment) => (
                            <tr key={assignment.id}>
                                <td>{assignment.id}</td>
                                <td>{assignment.student_name}</td>
                                <td>{assignment.email}</td>
                                <td>{assignment.filename}</td>
                                <td>{new Date(assignment.submitted_at).toLocaleString()}</td>
                                <td>
                                    <a href={ `http://localhost:5000/uploads/${assignment.filename} `} download>
                                        Download
                                    </a>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="6">No assignments submitted yet.</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

const buttonStyle = {
    margin: "10px",
    padding: "10px 20px",
    fontSize: "16px",
    cursor: "pointer"
};

export default TeacherDashboard;