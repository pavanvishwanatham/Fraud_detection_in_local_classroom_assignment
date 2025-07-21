const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

// ✅ Ensure the uploads directory exists
const uploadDir = "uploads/assignments/";
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
    console.log("📂 Created upload directory:", uploadDir);
}

app.use("/uploads", express.static(path.join(__dirname, "uploads/assignments")));

// ✅ Configure Multer for file uploads
const storage = multer.diskStorage({
    destination: uploadDir, // Folder to store assignments
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage });

// ✅ MySQL Database Connection
const db = mysql.createConnection({
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASS || "yourpassword",
    database: process.env.DB_NAME || "mydatabase"
});

db.connect(err => {
    if (err) {
        console.error("❌ Database connection failed: " + err.message);
        process.exit(1);
    } else {
        console.log("✅ Connected to MySQL database.");
    }
});

// ✅ API Route to Get Submitted Assignments
app.get("/api/get-submitted-assignments", (req, res) => {
    const sql = `
      SELECT a.id, s.name AS student_name, s.email, a.filename, a.submitted_at 
      FROM assignments a 
      JOIN students s ON a.student_id = s.id
    `;
  
    db.query(sql, (err, result) => {
      if (err) {
        console.error("Error fetching assignments:", err);
        res.status(500).json({ error: "Internal Server Error" });
      } else {
        res.json(result);
      }
    });
  });

const SECRET_KEY = process.env.JWT_SECRET || "your_secret_key";
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    }
});

const usedTokens = new Set();

function isValidPassword(password) {
  return /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,}$/.test(password);
}



// ✅ User Signup
app.post("/signup", (req, res) => {
  const { name, email, password } = req.body;
  const hashedPassword = bcrypt.hashSync(password, 10);

  db.query(
    "INSERT INTO students (name, email, password) VALUES (?, ?, ?)",
    [name, email, hashedPassword],
    (err, result) => {
      if (err) return res.status(500).json({ error: "Signup failed" });
      res.json({ message: "User registered successfully" });
    }
  );
});



// ✅ User Signup Route
app.post("/signup", (req, res) => {
    const { name, email, password } = req.body;
    const hashedPassword = bcrypt.hashSync(password, 10);

    db.query("INSERT INTO students (name, email, password) VALUES (?, ?, ?)", 
        [name, email, hashedPassword], 
        (err, result) => {
            if (err) return res.status(500).json({ error: "Signup failed" });
            res.json({ message: "User registered successfully" });
        }
    );
});

// ✅ User Login Route
app.post("/login", (req, res) => {
    try {
        console.log("Login request received");

        const { email, password } = req.body;
        console.log("Received email:", email);
        console.log("Received password:", password ? "******" : "No password provided"); // Mask password for security

        db.query("SELECT * FROM students WHERE email = ?", [email], (err, results) => {
            if (err) {
                console.error("Database error:", err);
                return res.status(500).json({ error: "Internal Server Error" });
            }

            console.log("Database query results:", results);

            if (results.length === 0) {
                console.log("No user found with the provided email");
                return res.status(401).json({ error: "Invalid credentials" });
            }

            const user = results[0];
            console.log("User found:", { id: user.id, email: user.email });

            const isPasswordMatch = bcrypt.compareSync(password, user.password);
            console.log("Password match:", isPasswordMatch);

            if (!isPasswordMatch) {
                console.log("Incorrect password");
                return res.status(401).json({ error: "Invalid credentials" });
            }

            const token = jwt.sign({ id: user.id, email: user.email, role: "student" }, SECRET_KEY, { expiresIn: "1h" });
            console.log("Generated token:", token);

            res.json({ message: "Login successful", token, role: "student" });
        });
    } catch (error) {
        console.error("Unexpected error:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// ✅ Forgot Password - Generate Reset Link
app.post("/forgot-password", (req, res) => {
    const { email } = req.body;
    db.query("SELECT * FROM students WHERE email = ?", [email], (err, result) => {
      if (err || result.length === 0)
        return res.status(400).json({ error: "Email not found" });
  
      const token = jwt.sign({ email }, SECRET_KEY, { expiresIn: "1h" });
      const resetLink = `http://localhost:3000/reset-password/${token}`;
  
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Password Reset Request",
        text: `Click the following link to reset your password: ${resetLink}`,
      };
  
      transporter.sendMail(mailOptions, (error) => {
        if (error) return res.status(500).json({ error: "Email not sent" });
        res.json({ message: "Reset link sent to email" });
      });
    });
});

// ✅ Reset Password - Set New Password
app.post("/reset-password", (req, res) => {
    const { token, newPassword } = req.body;
    try {
      if (usedTokens.has(token)) {
        return res
          .status(400)
          .json({ error: "This reset link has already been used." });
      }
      const decoded = jwt.verify(token, SECRET_KEY);
      if (!isValidPassword(newPassword)) {
        return res.status(400).json({
          error:
            "Password must contain at least 8 characters, a number, and a special character.",
        });
      }
      const hashedPassword = bcrypt.hashSync(newPassword, 10);
      db.query(
        "UPDATE students SET password = ? WHERE email = ?",
        [hashedPassword, decoded.email],
        (err) => {
          if (err)
            return res.status(500).json({ error: "Password reset failed" });
          usedTokens.add(token);
          res.json({ message: "Password reset successful" });
        }
      );
    } catch (err) {
      res.status(400).json({ error: "Invalid or expired token" });
    }
});

// ✅ Teacher Signup Route
app.post("/teacher-signup", (req, res) => {
    const { name, email, password } = req.body;
    const hashedPassword = bcrypt.hashSync(password, 10);

    db.query("INSERT INTO teachers (name, email, password) VALUES (?, ?, ?)", 
        [name, email, hashedPassword], 
        (err, result) => {
            if (err) return res.status(500).json({ error: "Signup failed" });
            res.json({ message: "Teacher registered successfully" });
        }
    );
});

// ✅ Teacher Login Route
app.post("/teacher-login", (req, res) => {
    try {
        console.log("Teacher login request received");

        const { email, password } = req.body;
        console.log("Received email:", email);
        console.log("Received password:", password ? "******" : "No password provided"); // Mask password for security

        db.query("SELECT * FROM teachers WHERE email = ?", [email], (err, results) => {
            if (err) {
                console.error("Database error:", err);
                return res.status(500).json({ error: "Internal Server Error" });
            }

            console.log("Database query results:", results);

            if (results.length === 0) {
                console.log("No teacher found with the provided email");
                return res.status(401).json({ error: "Invalid credentials" });
            }

            const user = results[0];
            console.log("Teacher found:", { id: user.id, email: user.email, role: "teacher" });

            const isPasswordMatch = bcrypt.compareSync(password, user.password);
            console.log("Password match:", isPasswordMatch);

            if (!isPasswordMatch) {
                console.log("Incorrect password");
                return res.status(401).json({ error: "Invalid credentials" });
            }

            const token = jwt.sign({ id: user.id, email: user.email, role: "teacher" }, SECRET_KEY, { expiresIn: "1h" });
            console.log("Generated token:", token);

            res.json({ message: "Login successful", token, role: "teacher" });
        });
    } catch (error) {
        console.error("Unexpected error:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// ✅ Middleware for Authentication
const verifyToken = (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
        return res.status(403).json({ error: "No token provided" });
    }

    jwt.verify(token, SECRET_KEY, (err, decoded) => {
        if (err) {
            return res.status(401).json({ error: "Unauthorized" });
        }
        req.user = decoded;
        next();
    });
};

// ✅ Assignment Submission
app.post("/submit-assignment", verifyToken, upload.single("file"), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
    }

    const email = req.user.email;

    db.query("SELECT id FROM students WHERE email = ?", [email], (err, results) => {
        if (err || results.length === 0) {
            return res.status(400).json({ error: "Student not found" });
        }

        const student_id = results[0].id;
        const filename = req.file.filename;
        const submitted_at = new Date();

        db.query(
            "INSERT INTO assignments (student_id, filename, submitted_at) VALUES (?, ?, ?)",
            [student_id, filename, submitted_at],
            (err) => {
                if (err) return res.status(500).json({ error: "Failed to submit assignment" });

                res.json({ message: "Assignment submitted successfully", filename });
            }
        );
    });
});


// ✅ Student Dashboard - View only their own assignments
app.get("/student-dashboard", verifyToken, (req, res) => {
    const studentId = req.user.id; // Extract student ID from token

    db.query(
        "SELECT * FROM assignments WHERE student_id = ?", 
        [studentId], 
        (err, results) => {
            if (err) return res.status(500).json({ error: "Failed to fetch assignments" });
            res.json({ message: "Student Dashboard", assignments: results });
        }
    );
});

// ✅ Teacher Dashboard - View all student assignments
app.get("/teacher-dashboard", verifyToken, (req, res) => {
    if (req.user.role !== "teacher") {
        return res.status(403).json({ error: "Access denied" });
    }

    db.query("SELECT assignments.*, students.name AS student_name FROM assignments JOIN students ON assignments.student_id = students.id", 
        (err, results) => {
            if (err) return res.status(500).json({ error: "Failed to fetch assignments" });
            res.json({ message: "Teacher Dashboard", assignments: results });
        }
    );
});

app.get("/assignments", async (req, res) => {
    try {
        const query = `
            SELECT assignments.id, assignments.filename, assignments.submitted_at, 
                   students.name AS student_name, students.email AS student_email 
            FROM assignments 
            INNER JOIN students ON assignments.student_id = students.id
            ORDER BY assignments.submitted_at DESC;
        `;
        
        db.query(query, (err, results) => {
            if (err) {
                console.error("Error fetching assignments:", err);
                return res.status(500).json({ error: "Database error" });
            }
            res.json(results);
        });
    } catch (error) {
        res.status(500).json({ error: "Server error" });
    }
});


// ✅ Start the Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`✅ Server running on port ${PORT}`);
});