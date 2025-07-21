import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import "./Dashboard.css";

const Dashboard = ({ token }) => {
    const navigate = useNavigate();
    
    const handleFileUpload = async () => {
        const selectedFile = document.getElementById("fileInput").files[0];
        const email = localStorage.getItem("email"); // Get stored email

        if (!selectedFile) {
            alert("Please select a file!");
            return;
        }

        if (!email) {
            alert("User email is missing. Please log in again.");
            return;
        }

        const formData = new FormData();
        formData.append("file", selectedFile);
        formData.append("email", email); // ✅ Send email to backend

        try {
            const response = await axios.post("http://localhost:5000/submit-assignment", formData, {
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem("token")}`, // ✅ Fixed template string issue
                    "Content-Type": "multipart/form-data"
                }
            });

            alert(response.data.message);
        } catch (error) {
            alert(error.response?.data?.error || "Assignment submission failed!");
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("token"); // ✅ Clear token on logout
        localStorage.removeItem("email"); // ✅ Clear email on logout
        navigate("/"); // Redirect to login
    };

    return (
        <div className="dashboard-container">
            <h2>Student Dashboard</h2>
            <div>
                <input id="fileInput" type="file" />
                <button className="upload-button" onClick={handleFileUpload}>Submit Assignment</button>
            </div>
            <button className="logout-button" onClick={handleLogout}>Logout</button>
        </div>
    );
};

export default Dashboard;