# Best Teacher - Content Management Component

A robust and modern Content Management System (CMS) designed for the "Best Teacher" platform. This module enables teachers to upload, manage, and organize educational materials while providing students with a seamless interface to discover, view, and download resources.

---

## 🚀 Project Overview

The **Content Management Component** is a full-stack MERN application (MongoDB, Express, React, Node.js) that handles the lifecycle of educational content. 

### Key Features
- **Secure File Uploads:** Upload PDFs, Documents, Presentations, and Videos.
- **Teacher Dashboard:** Comprehensive management of own resources (Edit metadata, Replace files, Soft delete).
- **Student Library:** High-performance browsing with search, multi-filter capabilities (Subject, Grade, Topic), and real-time feedback.
- **Local Storage System:** Files are organized by teacher ID for better folder structure and security.
- **Smooth UX:** Powered by Framer Motion for micro-interactions and transitions.

---

## 🛠️ Tech Stack

### Backend
- **Node.js & Express.js:** Core server framework.
- **MongoDB & Mongoose:** Database and ODM for material metadata.
- **Multer:** Middleware for handling `multipart/form-data` uploads.
- **JWT & Bcrypt:** Secure authentication and authorization (Teacher-only uploads).
- **Helmet & Morgan:** Security headers and logging.

### Frontend
- **React (Vite):** Modern, fast frontend development environment.
- **Framer Motion:** High-quality UI animations.
- **Lucide React:** Sleek and consistent iconography.
- **Axios:** For API communication.
- **CSS3:** Custom modern UI design (Vanilla CSS for maximum control).

---

## ⚙️ Setup & Installation

### Prerequisites
- [Node.js](https://nodejs.org/) (v16+ recommended)
- [MongoDB](https://www.mongodb.com/try/download/community) installed and running locally on port `27017`.

### 1. Clone the Repository
```bash
git clone <repository-url>
cd content-management-component
```

### 2. Backend Configuration
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create/Check `.env` file in `backend/`:
   ```env
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/content-manager
   JWT_SECRET=your_super_secret_jwt_key
   NODE_ENV=development
   ```
4. Start the server:
   ```bash
   npm run dev  # Starts with nodemon for auto-restart
   ```

### 3. Frontend Configuration
1. Open a new terminal and navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
4. Access the app at `http://localhost:5173`.

---

## 🛡️ Validations & Security

The system implements multiple layers of validation to ensure data integrity and security:

### Frontend Validations (React)
- **Required Fields:** Title, Subject, Grade, Topic, and File selection are strictly mandatory.
- **Title Length:** Must be at least **5 characters**.
- **Real-time Feedback:** Uses `react-dropzone` for immediate file rejection if size (>100MB) or type is invalid before hitting the server.
- **Error Visualization:** Dynamic CSS classes highlight invalid inputs with red borders and descriptive labels.

### File Validations (Backend - Multer)
- **Allowed Extensions:** `.pdf`, `.doc`, `.docx`, `.ppt`, `.pptx`, `.mp4`.
- **MIME Type Check:** Verifies actual file content (e.g., `application/pdf`, `video/mp4`) to prevent spoofing.
- **File Size Limit:** Maximum upload size is enforced at the server level at **100MB**.

### Access Control
- **Authentication:** Users must be logged in (JWT required) to perform management actions.
- **Role-based Authorization:** Only users with the `teacher` role can upload or modify resources.
- **Ownership Check:** Teachers can only edit/delete files they personally uploaded.

---

## 🗄️ Database Architecture

The project uses **MongoDB** as the primary database.

- **Storage Method:** 
  - **Metadata:** Stored in the `materials` collection in MongoDB.
  - **Files:** Stored on the local server disk at `backend/uploads/materials/:teacherId/`.
- **Soft Delete:** When a teacher "deletes" a resource, the system marks `isDeleted: true` in the database. The record remains for administrative audit, but it is filtered out from all public views.
- **Connection URI:** Default is `mongodb://localhost:27017/content-manager`.

---

## 🔗 API Endpoints

### Materials API (`/api/materials`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| **GET** | `/` | Public | Get all active materials (with search & filters) |
| **GET** | `/:id` | Public | Get detailed material by ID |
| **POST** | `/upload` | Teacher | Upload new material (file + metadata) |
| **PUT** | `/:id` | Teacher (Owner) | Update material metadata (Title, Topic, etc.) |
| **PUT** | `/:id/file` | Teacher (Owner) | Replace existing file with a new one |
| **DELETE** | `/:id` | Teacher (Owner) | Soft-delete a material |

---

## 📂 Project Structure

```text
/backend
  ├── controllers/     # Business logic for materials
  ├── models/          # Mongoose schemas (User, Material)
  ├── routes/          # Express API endpoints
  ├── middlewares/     # Auth and Multer upload logic
  ├── uploads/         # Structured file storage (static)
  └── server.js        # Main entry point

/frontend
  ├── src/
      ├── pages/       # Library, Upload Form, Home
      ├── components/  # Navbar, Material Cards, UI elements
      ├── assets/      # Global styles and static assets
      └── App.jsx      # Route management
```

---

## 📝 Future Scope
- Integration with AWS S3 for scalable file storage.
- Real-time notifications for new material arrivals.
- Advanced analytics for teachers on content popularity.
