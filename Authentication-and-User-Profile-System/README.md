# Authentication & User Profile System

A complete MERN stack (MongoDB, Express.js, React, Node.js) authentication and profile management system designed for an educational application connecting Students and Teachers. 

This project was built focusing on **production-ready security, robust UI/UX design, and deep data validation.**

## 🚀 Technologies Used
* **Frontend:** React, Vite, React Router DOM, Context API, pure CSS for styling.
* **Backend:** Node.js, Express.js, MongoDB + Mongoose.
* **Security & Auth:** JSON Web Tokens (JWT), `bcrypt` for password hashing, `cors`, `dotenv`.
* **Validation:** `express-validator` on the backend, Custom React hooks/logic on the frontend.

## ✨ Core Features
* **Role-Based Users:** Full support for separated `student` and `teacher` user accounts. Includes middleware architecture (`authorizeStudent`, `authorizeTeacher`) for protecting specific backend endpoints based on the logged-in user's role.
* **JWT Session Management:** Secure token generation upon login and registration. Tokens are verified via a custom authentication middleware (`protect`) before accessing any private routing.
* **Premium User Interface:** Fully responsive, vibrant modern UI design using glassmorphism, focus rings, hover animations, error/success banners, and clean modal overlays. 
* **Complete User Profile Lifecycle:**
  * **Registration:** Create an account with distinct roles.
  * **Login:** Authentication with immediate Context API state hydration.
  * **Profile Dashboard:** View member details, automatic initial-avatar generation, and account timeline data.
  * **Edit Details:** Update core contact fields and apply external Profile Picture URLs.
  * **Secure Password Change:** Requires validation of the old encrypted password before saving new credentials.
  * **Account Deletion:** Permenantly and deeply removes the user document from the database after a confirmation modal prompts the user.

## 🛡️ Strict Validation & Security

This system implements multiple layers of defensive validation to ensure data purity and protection against malicious entry patterns. Data is checked precisely at:
1. The Frontend UI layer (blocking input keystrokes, halting form submissions).
2. The Backend API layer (intercepting routes using `express-validator` and `mongoose` schemas).

### Validation Rules Implemented:
* **Contact Number Constraints:** 
   * Form inputs completely reject typing alphabetical or special characters.
   * Locked to precisely **10 numeric digits**.
   * Backend prevents submission if `contactNumber` is empty, contains letters, or falls short/exceeds 10 characters length.
* **Password Strength:**
   * Enforced minimum length of **6 characters**.
   * Change password form strictly enforces that "New Password" and "Confirm Password" logic matches before transmitting payloads over the network.
   * Verified dynamically against the previous `bcrypt` hash during updates.
* **Profile Pictures:**
   * Enforces matching valid web URLs beginning with `http://` or `https://` via frontend Regex string manipulation.
   * Validated server-side via `express-validator`'s `.isURL()` function.
* **Email Constraints:**
   * Handled by standard web input types, backed by regex patterns on the Mongoose Database schema.
   * Hard-checks against MongoDB at runtime avoiding any Duplicate Email registrations across different user roles.
* **Empty Values:**
   * Form submissions are halted on the React side if critical fields (Name, Contact, Email, Password) are blank.
   * `express-validator` utilizes `.notEmpty()` parameters ensuring blank overrides aren't physically possible via API spoofing tools (like Postman / Insomnia).

## ⚙️ How to Run Locally

### 1. Prerequisites 
Make sure you have Node JS installed. 
You will also need a local MongoDB instance running on your machine, or a MongoDB Atlas URI string.

### 2. Configure Environment Variables
Inside the `backend/` directory, there is a `.env` file configuration (or create one using this template):
```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://127.0.0.1:27017/auth-profile-db
JWT_SECRET=super_secret_jwt_key_here_please_change
```

### 3. Install & Start Backend
Open a terminal inside the project folder, navigate into the backend, and run the development server:
```bash
cd backend
npm install
npm run dev
```
*(The backend runs on http://localhost:5000)*

### 4. Install & Start Frontend
Open a new separate terminal, navigate into the frontend folder, and launch the Vite React server:
```bash
cd frontend
npm install
npm run dev
```
*(The frontend runs on http://localhost:3000)*
