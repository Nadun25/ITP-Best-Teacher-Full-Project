# 🎓 Best Teacher Platform - Quiz & Assessment Management

A high-performance, professional academic assessment system designed to streamline the connection between teachers and students. Built with the **MERN** stack (MongoDB, Express, React, Node.js), this platform features a modern **Glassmorphism UI** and sophisticated grading logic.

---

## 🚀 How to Run the Project

### 1. Prerequisites
- **Node.js** (v16 or higher)
- **MongoDB** (Local instance or Atlas)

### 2. Backend Setup
```bash
cd backend
npm install
```
Create a `.env` file in the `backend/` directory:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/best-teacher-quiz
NODE_ENV=development
JWT_SECRET=your_secret_key
```
Start the server:
```bash
npm run dev
```

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 🛡️ Robust Validations

We have implemented multi-layered validation to ensure data integrity and a smooth user experience.

### 📝 Frontend Validations (React)
- **Deadline Protection**: Teachers are physically blocked from picking past dates. The system greys out old dates and validates the logic upon submission.
- **Form Completeness**: Quizzes cannot be saved without a Title, Subject, Grade Level, and at least one complete question.
- **Option Validation**: MCQ questions require all options to be filled and at least one correct answer to be toggled.
- **Submission Shield**: Students are warned if they attempt to submit a quiz with unanswered questions.
- **Points Boundary**: Manual grading is restricted between 0 and the maximum points assigned to the question.

### ⚙️ Backend Validations (Node.js/Express)
- **Schema Enforcement**: Mongoose schemas strictly define data types and mandatory fields (e.g., `questionText`, `points`).
- **Middleware Checks**: Authorization middleware ensures Students cannot access Teacher-only routes (like creating/deleting quizzes).
- **Express-Validator**: Input sanitization and validation on API endpoints to prevent malicious or malformed data.

---

## 🔑 Important Modules & Features

### 1. Comprehensive Quiz Creator
Supports three primary question types:
- **MCQ (Multiple Choice)**: Auto-graded instantly.
- **TRUE/FALSE**: High-speed assessment type.
- **SHORT ANSWER**: Allows descriptive responses for manual teacher review.

### 2. Intelligent Grading Logic
- **Auto-Grade Engine**: Instantly calculates scores for objective questions upon submission.
- **Manual Review Interface**: Teachers can view student responses and award specific points for descriptive answers.

### 3. Dev-Friendly Auth System
The project uses a **Mock Role-Encoded Token** system for development ease. You can switch between "Teacher" and "Student" roles instantly via the Navigation Bar without needing to manage complex login credentials during testing.

### 4. Premium Aesthetic System
A custom-built CSS utility system in `index.css` provides:
- **Glassmorphism**: Transparent, blurred cards for a modern feel.
- **Interactive States**: Hover effects, scale animations, and glowing buttons.
- **Dark Mode Optimization**: Deep navy backgrounds tailored for focus.

---

## 🗄️ Database & Models

### Connection
The database is hosted on **MongoDB**. Connection strings are managed via the `MONGO_URI` environment variable.

### Data Seeding
Upon the first startup, the server automatically seeds the database with:
- **Mock Teacher**: `Dr. Smith`
- **Mock Student**: `John Doe`
This ensures all relationships (Submissions -> Users) work correctly right out of the box.

### Core Models:
- **User**: Stores identities and roles.
- **Quiz**: The blueprint for assessments.
- **Question**: Discrete assessment items within a quiz.
- **Submission**: Records student responses, scores, and grading status.

---

## 🛠️ Tech Stack
- **Frontend**: Vite, React, Lucide Icons, Axios.
- **Backend**: Express, Node.js, Mongoose.
- **Database**: MongoDB.
- **Styling**: Vanilla CSS (Custom Utility System).
