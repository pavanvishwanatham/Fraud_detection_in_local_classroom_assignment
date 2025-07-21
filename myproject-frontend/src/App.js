import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Link, Navigate } from "react-router-dom";
import RoleSelection from "./Roleselection";
import Signup from "./Signup";
import Login from "./Login";
import ForgotPassword from "./ForgotPassword";
import ResetPassword from "./ResetPassword";
import Dashboard from "./Dashboard";
import TeacherDashboard from "./TeacherDashboard";
import TeacherLogin from "./TeacherLogin";
import TeacherSignup from "./TeacherSignup";
import "./App.css"; // Ensure this is imported for styling

const App = () => {
    const [token, setToken] = useState(localStorage.getItem("token"));
    const [role, setRole] = useState(localStorage.getItem("role") || "");

    useEffect(() => {
        if (token) localStorage.setItem("token", token);
        else localStorage.removeItem("token");
    }, [token]);

    useEffect(() => {
        if (role) localStorage.setItem("role", role);
        else localStorage.removeItem("role");
    }, [role]);

    return (
        <Router>
                
                <Routes>
                    {/* <Route path="/" element={<RoleSelection />} /> */}
                    <Route path="/role-selection" element={<RoleSelection />} />
                    <Route path="/signup" element={<Signup />} />
                    <Route path="/login" element={<Login setToken={setToken} setRole={setRole} />} />
                    <Route path="/dashboard" element={token && role === "student" ? <Dashboard token={token} /> : <Navigate to="/login" />} />
                    <Route path="/forgot-password" element={<ForgotPassword />} />
                    <Route path="/reset-password/:token" element={<ResetPassword />} />
                    {/* Teacher Routes */}
                    <Route path="/teacher-login" element={<TeacherLogin setToken={setToken} setRole={setRole} />} />
                    <Route path="/teacher-signup" element={<TeacherSignup />} />
                    <Route path="/teacher-dashboard" element={token && role === "teacher" ? <TeacherDashboard token={token} /> : <Navigate to="/teacher-login" />} />

                    {/* Redirect unknown routes to home */}
                    <Route path="/" element={<Navigate to="/login" />} />
                </Routes>
        </Router>
    );
};

export default App;