# 📘 Fraud Detection in Local Classroom Assignments

A full-stack **React + Node.js + MySQL** application for detecting plagiarism and fraud in classroom assignment submissions.
The system provides dedicated dashboards for **Students** and **Teachers**, with secure authentication, file uploads, similarity scoring, and fraud reporting.

---

## 🚀 Features

### 👩‍🎓 Student Portal

- Upload assignments (PDF, DOCX, TXT, etc.)
- View past submissions
- Receive alerts if similarity or fraud is detected

### 👨‍🏫 Teacher Portal

- View all student submissions
- Compare assignments with automated similarity scoring
- Flag suspicious submissions
- Generate fraud reports

### 🕵️ Plagiarism Detection

- Server-side cosine similarity on preprocessed text
- Detects copied or near-duplicate assignments
- Works even if text is:
  - rearranged
  - slightly modified
  - partially copied

### 🔐 Role-Based Authentication

- JWT-based login system
- Student & Teacher accounts with separate dashboards
- Secure routes handled at backend + protected frontend pages

---


## 🧠 How Fraud Detection Works

- Student uploads assignment file
- Backend extracts text (supports PDF, DOCX, TXT)
- Text is vectorized and compared with previous submissions
- Cosine similarity score is generated
- If score ≥ threshold → submission is flagged
- Teacher dashboard displays flagged cases

---

## 🛠️ Tech Stack

### Frontend

- React.js
- React Router DOM
- Axios
- HTML/CSS (custom UI)

### Backend

- Node.js + Express.js
- Multer (file upload)
- MySQL / MySQL2
- JSON Web Tokens (JWT)
- BcryptJS (password hashing)
- Nodemailer (optional for email alerts)

### Database

- MySQL (stores users, submissions, similarity reports)

---

## 📁 Folder Structure

```

Fraud_detection_in_local_classroom_assignment/
│── myproject-frontend/        # React UI
│     ├── public/
│     ├── src/
│     ├── package.json
│
│── myproject-backend/         # Node.js API server
│     ├── uploads/             # Uploaded assignment files
│     ├── routes/
│     ├── controllers/
│     ├── models/
│     ├── server.js
│     ├── package.json
│
│── README.md

```

---

## 🗄️ MySQL Setup

This project uses **MySQL** for storing users, assignments, and plagiarism reports.

### 1️⃣ Run `login page.sql`
This script will:
- Create the database (`mydatabase` by default)
- Create the `students` table used for student signup/login
- Insert sample student rows (optional — delete them if not needed)

### 2️⃣ Create the remaining tables  
Run the SQL from these files **in the same database**:

- `teachers table.txt` → creates the **teachers** table  
- `assignments table.txt` → creates the **assignments** table  
- `plagarism table.txt` → creates the **plagiarism reports** table  

> Open each file → copy SQL → execute in MySQL Workbench / phpMyAdmin / CLI.

### 3️⃣ Configure database name in `.env`

Make sure your `.env` file uses the **same database name** as created in `login page.sql`:

```env
DB_HOST=localhost
DB_USER=your_mysql_user
DB_PASS=your_mysql_password
DB_NAME=mydatabase   # must match the database created in login page.sql
```
You may rename the database, but then update it in:

-  `login page.sql`
-  `.env`

---
  
## ⚙️ Installation & Setup

### 🔧 1. Clone the repository

```
git clone https://github.com/pavanvishwanatham/Fraud_detection_in_local_classroom_assignment
cd Fraud_detection_in_local_classroom_assignment
```

## 🖥️ Backend Setup (Node.js + Express)

### 2. Go to backend folder

```
cd myproject-backend
```

### 3. Install backend dependencies

```
npm install
```

### 4. Configure environment variables
   
Inside **myproject-backend**, create a ``` .env ``` file:

```
PORT=5000
DB_HOST=localhost
DB_USER=your_mysql_user
DB_PASS=your_mysql_password
DB_NAME=your_database_name
EMAIL_USER=your_email
EMAIL_PASS=your_password
JWT_SECRET=your_jwt_secret
```
`DB_NAME` must match the name created during **MySQL Setup.**

### 5. Start the backend server

```
npm start
```

Runs at:

👉 `http://localhost:5000`

## 🌐 Frontend Setup (React App)

### 1. Go to frontend folder

```
cd ../myproject-frontend
```

### 2. Install frontend dependencies

```
npm install
```

### 3. Start the React app

```
npm start
```

Frontend runs at:
👉 `http://localhost:3000`

---

## 📡 API Endpoints

### 🔐 Authentication (Students)

| Method | Endpoint | Description |
|--------|----------|-------------|
| **POST** | `/signup` | Register a new student account |
| **POST** | `/login` | Student login (returns JWT token) |
| **POST** | `/forgot-password` | Sends password reset link to email |
| **POST** | `/reset-password` | Resets password using token |

---

### 👨‍🏫 Authentication (Teachers)

| Method | Endpoint | Description |
|--------|----------|-------------|
| **POST** | `/teacher-signup` | Register a new teacher account |
| **POST** | `/teacher-login` | Teacher login (returns JWT token) |

---

### 📝 Assignments

| Method | Endpoint | Description |
|--------|----------|-------------|
| **POST** | `/submit-assignment` | Student uploads an assignment (file upload + DB entry) |
| **GET** | `/student-dashboard` | Student views their own submissions |
| **GET** | `/teacher-dashboard` | Teacher views all student submissions |
| **GET** | `/assignments` | Fetch all assignments with student details |
| **GET** | `/api/get-submitted-assignments` | Returns all submitted assignments (with student info) |

---

### 🔐 Middleware (JWT Protected Routes)

The following routes require a valid JWT token:

- `/submit-assignment`
- `/student-dashboard`
- `/teacher-dashboard`

Requests must include:

```
Authorization: Bearer <token>
```





