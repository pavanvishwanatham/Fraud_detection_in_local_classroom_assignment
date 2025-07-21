import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const TeacherLogin = ({ setToken, setRole }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [localToken, setLocalToken] = useState(null);
    const [localRole, setLocalRole] = useState(null);
    
    const navigate = useNavigate();

    useEffect(() => {
        if (localToken && localRole === "teacher") {
            console.log("Role updated, navigating to teacher dashboard...");
            setTimeout(() => navigate("/teacher-dashboard"), 100);
        }
    }, [localToken, localRole, navigate]); // Only navigate when both token and role are set

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            console.log("Attempting login with email:", email);

            const response = await axios.post(
                "http://localhost:5000/teacher-login",
                { email, password },
                { headers: { "Content-Type": "application/json" } }
            );

            console.log("Server response:", response.data);

            const { token, role, message } = response.data;

            if (token && role === "teacher") {
                console.log("Login successful. Storing token & role and redirecting...");
                alert(message || "Login Successful!");
                setToken(token);
                setRole(role); 
                setLocalToken(token); 
                setLocalRole(role);
            } else {
                console.log("Role mismatch or missing token. Access denied.");
                alert("Access Denied: You are not authorized to log in as a teacher.");
            }
        } catch (error) {
            console.error("Login error:", error.response?.data || error);
            alert(error.response?.data?.error || "Login failed! Check your credentials.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ textAlign: "center", marginTop: "50px" }}>
            <h2>Teacher Login</h2>
            <form 
                onSubmit={handleLogin} 
                style={{ display: "flex", flexDirection: "column", gap: "10px", width: "300px", margin: "auto" }}
            >
                <input 
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    style={{ padding: "10px", fontSize: "16px" }}
                />
                <input 
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    style={{ padding: "10px", fontSize: "16px" }}
                />
                <button 
                    type="submit" 
                    disabled={loading} 
                    style={{ padding: "10px", fontSize: "16px", cursor: loading ? "not-allowed" : "pointer" }}
                >
                    {loading ? "Logging in..." : "Login"}
                </button>
            </form>

            <p>
                Don't have an account?{" "}
                <span 
                    style={{ color: "blue", cursor: "pointer" }} 
                    onClick={() => navigate("/teacher-signup")}
                >
                    Signup
                </span>
            </p>
        </div>
    );
};

export default TeacherLogin;
