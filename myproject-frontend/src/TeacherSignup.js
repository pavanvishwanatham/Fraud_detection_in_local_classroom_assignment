import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const TeacherSignup = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSignup = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await axios.post("http://localhost:5000/teacher-signup", { name, email, password });

            if (response.data.message) {
                alert(response.data.message);
                navigate("/teacher-login"); // Redirect to login after successful signup
            } else {
                alert("Unexpected response from server!");
            }
        } catch (error) {
            alert(error.response?.data?.error || "Signup failed! Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ textAlign: "center", marginTop: "50px" }}>
            <h2>Teacher Signup</h2>
            <form onSubmit={handleSignup} style={{ display: "flex", flexDirection: "column", gap: "10px", width: "300px", margin: "auto" }}>
                <input
                    type="text"
                    placeholder="Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    style={{ padding: "10px", fontSize: "16px" }}
                />
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
                <button type="submit" disabled={loading} style={{ padding: "10px", fontSize: "16px", cursor: loading ? "not-allowed" : "pointer" }}>
                    {loading ? "Signing up..." : "Signup"}
                </button>
            </form>
            <p>
                Already have an account?{" "}
                <span style={{ color: "blue", cursor: "pointer" }} onClick={() => navigate("/teacher-login")}>
                    Login
                </span>
            </p>
        </div>
    );
};

export default TeacherSignup;