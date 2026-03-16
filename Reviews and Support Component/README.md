# Best Teacher: Reviews & Support Ecosystem

A high-performance, production-ready MERN stack module designed for the "Best Teacher" platform. This system facilitates transparent feedback between students and teachers and provides a robust ticket-based support infrastructure for resolving platform issues.

---

## 🌟 Pro-Simulation Mode
To facilitate seamless testing and demonstration without a complex authentication setup, this project includes a **Simulation Toolbar** at the top of the interface. This allows you to instantly switch identities:

*   👩‍🎓 **John Student**: Can browse teachers, post validated reviews, and raise support tickets.
*   👨‍🏫 **Prof. Smith**: Can view student inquiries directed to them, respond to issues, and update ticket statuses. They can also raise tickets to Admin.
*   🛡️ **System Admin**: Can view all platform tickets, manage inappropriate content, and resolve complex issues.

---

## 🎫 Ticket Support System Features
*   **Role-Based Dashboards**: Real-time filtering shows users only the tickets relevant to them.
*   **Conversation Threads**: Seamless messaging between students and recipients with distinct stylistic separation for responders.
*   **Read Receipts ("Seen")**: Real-time indicators inform students when a teacher or admin has viewed their request.
*   **Status Management**: Dynamic lifecycle tracking (Open → In Progress → Resolved → Closed).
*   **Ownership Control**: Creators can delete their own tickets to maintain a clean history.

---

## ⭐ Review System Features
*   **Aggregated Ratings**: Automatic calculation of a teacher's average rating and total review count.
*   **Validated Feedback**: Enforced character limits and star selections to ensure high-quality, constructive feedback.
*   **Real-time profile updates**: Teacher summary cards update immediately upon a new review submission.

---

## 🛡️ Validation System Architecture

### 1. Frontend Form Validations
We implement immediate client-side feedback to enhance UX and prevent unnecessary server load.

| Feature | Field | Validation Rule | Error Message |
| :--- | :--- | :--- | :--- |
| **Reviews** | Star Rating | Must be selected (1-5) | "Please select a star rating" |
| | Comment | Min 10, Max 500 chars | "Comment must be at least 10 characters" |
| **Tickets** | Subject | Min 5 characters | "Subject must be at least 5 characters" |
| | Description | Min 20 characters | "Description must be at least 20 chars" |
| **Replies** | Message | Sanitized / Non-empty | "Reply is too short" |

### 2. Backend Logic & Security
*   **Role Protection**: Middleware ensures only students can post reviews and only recipients/admins can update ticket statuses.
*   **Identity Verification**: The system verifies that the `studentId` of a ticket matches the requesting user's ID before allowing a `DELETE` operation.
*   **Schema Constraints**: Mongoose models enforce data types, required fields, and enum values for statuses and roles.
*   **BSON Handling**: Controller logic strips empty identifiers to prevent casting errors during creation.

---

## 🚀 Getting Started

### 1. Backend Setup
```bash
cd backend
npm install
# Ensure .env is configured with MONGO_URI and JWT_SECRET
node seed.js # IMPORTANT: Seeds the 3 simulation users
npm run dev
```

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

---

## 🛠️ Technology Stack
*   **Frontend**: React, TailwindCSS, Axios, React Router.
*   **Backend**: Node.js, Express.js, MongoDB, Mongoose.
*   **Security**: JWT-based authentication (Mocked for simulation), Role-Based Access Control (RBAC).
