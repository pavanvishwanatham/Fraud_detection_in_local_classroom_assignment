import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import "./Login.css";

const Login = ({ setToken, setRole }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();

        let response; 

        try {
            response = await axios.post("http://localhost:5000/login", { email, password });
            console.log(JSON.stringify(response.data, null, 2));
        } catch (error) {
            console.error("Error:", error.response ? JSON.stringify(error.response.data, null, 2) : error.message);
            alert(error.response?.data?.error || "Login failed!");
            return;
        }

        console.log("hi", response);

        const { token, role } = response.data;
        localStorage.setItem("token", token);
        localStorage.setItem("role", role);
        localStorage.setItem("email", email);

        setToken(token);
        setRole(role);

        alert(response.data.message);

        if (role === "student") {
            navigate("/dashboard");
        } else if (role === "teacher") {
            navigate("/teacher-dashboard");
        }
    };

    return (
        <div className="welcome-container">
                <h1 className="welcome-title">Welcome to Our Portal</h1>
                <p className="welcome-text">Securely login or sign up to access your dashboard.</p>
        <form onSubmit={handleLogin}>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" required />
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" required />
            <p>
                <Link to="/forgot-password">Forgot Password?</Link>
            </p>
            <button type="submit">Login</button>
            <p>
                Don't have an account? <Link to="/signup">Signup</Link>
            </p>
            <p>
                Are you a teacher? <Link to="/teacher-login">Click here</Link>
            </p>
            
        </form>
        </div>
    );
};

export default Login;
