📘 Fraud Detection in Local Classroom Assignments

A full-stack React + Node.js + MySQL application for detecting plagiarism and fraud in classroom assignment submissions.
The system provides dedicated dashboards for Students and Teachers, with secure authentication, file uploads, similarity scoring, and fraud reporting.

🚀 Features

👩‍🎓 Student Portal

- Upload assignments (PDF, DOCX, TXT, etc.)

- View past submissions

- Receive alerts if similarity or fraud is detected

👨‍🏫 Teacher Portal

- View all student submissions

- Compare assignments with automated similarity scoring

- Flag suspicious submissions

- Generate fraud reports

🕵️ Plagiarism Detection

- Server-side cosine similarity on preprocessed text

- Detects copied or near-duplicate assignments

- Works even if text is:
  - rearranged

  - slightly modified

  - partially copied

🔐 Role-Based Authentication

- JWT-based login system

- Student & Teacher accounts with separate dashboards

- Secure routes handled at backend + protected frontend pages

🧠 How Fraud Detection Works

- Student uploads assignment file

- Backend extracts text (supports PDF, DOCX, TXT)

- Text is vectorized and compared with previous submissions

- Cosine similarity score is generated

- If score ≥ threshold → submission is flagged

- Teacher dashboard displays flagged cases

🛠️ Tech Stack

Frontend

- React.js

- React Router DOM

- Axios

- HTML/CSS (custom UI)

Backend

- Node.js + Express.js

- Multer (file upload)

- MySQL / MySQL2

- JSON Web Tokens (JWT)

- BcryptJS (password hashing)

- Nodemailer (optional for email alerts)

Database

- MySQL (stores users, submissions, similarity reports)

📁 Folder Structure

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

