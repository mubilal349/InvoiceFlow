<img width="945" height="411" alt="image" src="https://github.com/user-attachments/assets/85f51e8e-e971-4464-a97d-506a2895ae92" />


# InvoiceFlow

InvoiceFlow is a modern full-stack invoice management platform built with the **MERN stack**. It provides a secure and responsive dashboard for managing invoices, monitoring financial activity, and viewing business insights.

The platform uses role-based access control so that **administrators can create, edit, update, and delete invoices**, while regular users can view invoice information according to their permissions.

---

## 🚀 Features

### 🔐 Authentication & Authorization

* User registration and login
* JWT-based authentication
* Secure password hashing
* Protected API routes
* Role-based access control
* Admin and user roles
* Automatic authentication validation
* Protected dashboard access
* Account status validation

### 🧾 Invoice Management

Administrators have complete control over invoices.

* Create new invoices
* View invoices
* Edit invoices
* Update invoice information
* Delete invoices
* Track invoice status
* Store customer information
* Store invoice dates
* Track invoice totals
* View invoice details
* Manage invoice records from the dashboard

### 👤 User Access

Regular users have restricted access to invoice management.

* View available invoices
* Access authorized dashboard features
* Cannot create invoices
* Cannot edit invoices
* Cannot delete invoices

This ensures that invoice management remains under administrative control.

### 📊 Business Overview

The dashboard provides financial insights based on invoice data.

* Total invoice count
* Invoice revenue
* Paid invoices
* Pending invoices
* Overdue invoices
* Revenue trends
* Monthly invoice activity
* Financial overview chart

The Business Overview dynamically uses invoice data rather than displaying static information.

### 📋 Recent Invoices

The dashboard includes a Recent Invoices section that allows users to quickly see recently created invoice records.

Information can include:

* Invoice number
* Customer
* Date
* Amount
* Status
* Invoice actions

The recent invoice section is designed to remain responsive and display invoice information clearly on different screen sizes.

### 📈 Financial Analytics

InvoiceFlow can calculate financial information directly from invoice records.

Example metrics:

```text
Total Revenue
Paid Revenue
Pending Revenue
Overdue Revenue
Total Invoices
```

Revenue can also be represented through charts to provide a visual overview of business activity.

### ⚙️ Responsive Dashboard

InvoiceFlow is designed to work across:

* Desktop
* Laptop
* Tablet
* Mobile devices

The dashboard includes a responsive sidebar and mobile-friendly layout.

---

# 🛠️ Technology Stack

## Frontend

* React.js
* JavaScript
* HTML5
* CSS3
* React Hooks
* Responsive CSS
* Recharts

## Backend

* Node.js
* Express.js
* JavaScript
* JWT
* bcrypt / bcryptjs

## Database

* MongoDB
* MongoDB Atlas
* Mongoose

## Development Tools

* Git
* GitHub
* VS Code
* npm

---

# 📁 Project Structure

```text
InvoiceFlow/
│
├── client/
│   ├── public/
│   │
│   └── src/
│       ├── components/
│       │   ├── Sidebar.jsx
│       │   ├── Topbar.jsx
│       │   └── ...
│       │
│       ├── pages/
│       │   ├── Dashboard.jsx
│       │   ├── Invoice.jsx
│       │   ├── Login.jsx
│       │   └── Register.jsx
│       │
│       ├── services/
│       │   ├── authService.js
│       │   └── invoiceService.js
│       │
│       ├── context/
│       │   └── AuthContext.jsx
│       │
│       ├── App.jsx
│       ├── main.jsx
│       └── index.css
│
├── server/
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js
│   │   │
│   │   ├── controllers/
│   │   │   ├── authController.js
│   │   │   └── invoiceController.js
│   │   │
│   │   ├── middleware/
│   │   │   └── authMiddleware.js
│   │   │
│   │   ├── models/
│   │   │   ├── User.js
│   │   │   └── Invoice.js
│   │   │
│   │   ├── routes/
│   │   │   ├── authRoutes.js
│   │   │   └── invoiceRoutes.js
│   │   │
│   │   └── server.js
│   │
│   ├── .env
│   └── package.json
│
├── .gitignore
└── README.md
```

---

# ⚙️ Installation

## 1. Clone the Repository

```bash
git clone https://github.com/your-username/invoiceflow.git
```

Navigate into the project:

```bash
cd invoiceflow
```

---

# 📦 Backend Setup

Navigate to the server directory:

```bash
cd server
```

Install dependencies:

```bash
npm install
```

Create a `.env` file inside the `server` directory.

```env
PORT=8000

MONGO_URI=your_mongodb_connection_string

JWT_SECRET=your_jwt_secret
```

Start the backend server:

```bash
npm run dev
```

Or:

```bash
npm start
```

The backend will run on:

```text
http://localhost:8000
```

---

# 💻 Frontend Setup

Open another terminal and navigate to the client:

```bash
cd client
```

Install dependencies:

```bash
npm install
```

Start the React development server:

```bash
npm run dev
```

The frontend will normally be available at:

```text
http://localhost:5173
```

---

# 🔑 Environment Variables

The backend requires the following environment variables:

| Variable     | Description                    |
| ------------ | ------------------------------ |
| `PORT`       | Backend server port            |
| `MONGO_URI`  | MongoDB connection string      |
| `JWT_SECRET` | Secret used to sign JWT tokens |

Example:

```env
PORT=8000
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/invoiceflow
JWT_SECRET=your-super-secret-key
```

> Never commit your `.env` file to GitHub.

---

# 🔐 Authentication Flow

InvoiceFlow uses JWT authentication.

The general authentication process is:

```text
User
  ↓
Login
  ↓
Backend validates credentials
  ↓
JWT token generated
  ↓
Token returned to frontend
  ↓
Token stored securely
  ↓
Protected API requests
  ↓
Auth Middleware
  ↓
Authorized User
```

Protected requests include the JWT token:

```http
Authorization: Bearer <token>
```

The backend verifies the token before allowing access to protected resources.

---

# 👥 Role-Based Access Control

InvoiceFlow supports two primary roles:

### Admin

Administrators can:

* Create invoices
* View invoices
* Edit invoices
* Update invoices
* Delete invoices
* Manage invoice information
* View financial analytics
* Access administrative functionality

### User

Regular users can:

* Log in
* Access the dashboard
* View permitted invoice information
* View financial information available to them

Users do not have permission to modify or delete invoices.

---

# 🧾 Invoice Workflow

The invoice workflow is designed around administrator-controlled invoice management.

```text
Admin Login
     ↓
Dashboard
     ↓
Create Invoice
     ↓
Invoice Saved to MongoDB
     ↓
Recent Invoices Updated
     ↓
Business Overview Updated
     ↓
Financial Chart Updated
```

When an invoice is modified or deleted, the dashboard data can be refreshed to reflect the latest information.

---

# 📊 Dashboard

The InvoiceFlow dashboard provides a central location for monitoring invoice activity.

### Dashboard sections include:

* Business Overview
* Financial Analytics
* Revenue Chart
* Recent Invoices
* Invoice Statistics
* User Information
* Responsive Sidebar
* Navigation

The dashboard is designed to provide a quick overview without requiring administrators to navigate through multiple pages.

---

# 📈 Revenue Chart

The Business Overview can visualize invoice revenue over time.

For example:

```text
Revenue
  │
  │             ●
  │        ●         ●
  │    ●
  │ ●
  └──────────────────────
    Jan Feb Mar Apr May
```

The chart is generated from actual invoice records.

The system can calculate:

```text
Monthly Revenue
Paid Revenue
Pending Revenue
Overdue Revenue
```

This makes the dashboard useful for monitoring business performance.

---

# 📋 Recent Invoices

The Recent Invoices section displays recently created invoice records.

Example:

```text
Recent Invoices

INV-001     Muhammad     Rs. 25,000     Paid
INV-002     Ali          Rs. 18,500     Pending
INV-003     Ahmed        Rs. 32,000     Paid
INV-004     Usman        Rs. 12,000     Overdue
```

The section is kept independent from the Business Overview so that adding financial charts does not interfere with invoice listing functionality.

---

# 🔌 API Structure

Example authentication endpoints:

```http
POST /api/auth/register
POST /api/auth/login
```

Example invoice endpoints:

```http
GET    /api/invoices
GET    /api/invoices/:id
POST   /api/invoices
PUT    /api/invoices/:id
DELETE /api/invoices/:id
```

Administrative invoice operations should be protected by authentication and role-based authorization middleware.

---

# 🛡️ Security

InvoiceFlow uses several security mechanisms:

* JWT authentication
* Password hashing
* Protected API routes
* Authentication middleware
* Role-based authorization
* Environment variables
* MongoDB security
* Input validation
* Restricted administrative operations

Sensitive configuration such as database credentials and JWT secrets should never be committed to source control.

---

# 📱 Responsive Design

InvoiceFlow uses responsive CSS to provide a consistent experience across devices.

### Desktop

* Full sidebar
* Dashboard cards
* Financial charts
* Recent invoices
* Complete navigation

### Tablet

* Responsive dashboard grid
* Reduced spacing
* Adapted invoice tables

### Mobile

* Collapsible sidebar
* Responsive cards
* Mobile-friendly invoice layout
* Horizontally manageable invoice information
* Responsive charts

---

# 🧪 Development

Run the frontend and backend separately during development.

### Backend

```bash
cd server
npm run dev
```

### Frontend

```bash
cd client
npm run dev
```

---

# 🚀 Future Improvements

Possible future features include:

* PDF invoice generation
* Invoice download
* Invoice printing
* Email invoices directly to customers
* Automated payment reminders
* Online payment integration
* Customer management
* Recurring invoices
* Invoice search
* Advanced filtering
* Invoice sorting
* Export invoices to CSV
* Detailed financial reports
* Expense tracking
* Tax calculation
* Multi-currency support
* Dark mode
* Notification system
* Admin activity logs
* Audit history
* Advanced analytics
* Cloud deployment

---

# 🌐 Deployment

InvoiceFlow can be deployed using services such as:

### Frontend

* Vercel
* Netlify

### Backend

* Render
* Railway
* AWS

### Database

* MongoDB Atlas

A typical production architecture:

```text
                    ┌─────────────────┐
                    │     User        │
                    └────────┬────────┘
                             │
                             ▼
                    ┌─────────────────┐
                    │ React Frontend  │
                    │    InvoiceFlow  │
                    └────────┬────────┘
                             │
                             ▼
                    ┌─────────────────┐
                    │ Express / Node  │
                    │     Backend     │
                    └────────┬────────┘
                             │
                             ▼
                    ┌─────────────────┐
                    │ MongoDB Atlas   │
                    └─────────────────┘
```

---

# 🧑‍💻 Author

**Muhammad Bilal**

Full Stack Developer

### Technologies

```text
React
Node.js
Express.js
MongoDB
Mongoose
JavaScript
JWT
REST APIs
CSS
Git
GitHub
```

---

# 📄 License

This project is created for educational and portfolio purposes.

You may modify and extend the project for your own development and learning.

---

# ⭐ Support

If you find InvoiceFlow useful, consider giving the repository a ⭐ on GitHub.

---

## 📌 Project Status

**InvoiceFlow is actively under development.**

New features and improvements are being added as the project evolves.
