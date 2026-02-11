# 🏢 Enterprise Employee ERP System

![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![NodeJS](https://img.shields.io/badge/node.js-%2343853D.svg?style=for-the-badge&logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB)
![Postgres](https://img.shields.io/badge/postgres-%23316192.svg?style=for-the-badge&logo=postgresql&logoColor=white)
![Bootstrap](https://img.shields.io/badge/bootstrap-%23563D7C.svg?style=for-the-badge&logo=bootstrap&logoColor=white)

A full-stack Human Resource Management System designed to streamline employee data entry, dynamic master configuration, and complex payroll processing. Built with **Type-Safety** and **Relational Database Integrity** at its core.

---

## 📸 Screenshots

*(Add your screenshots here! Example:)*
| Dashboard | Salary Master |
|-----------|---------------|
| !([Screenshot (56).png](https://github.com/Abdulaksha/Employee-ERP-System/commit/5ef255777975c6ab36f836e55180b3bbee4330e7#diff-ec7e2a1b2a70a91e080ed3b0e2e8bb8b7d5fd4cc27e345bfc6984d1f0b05ec28)) | ![Salary Setup](Screenshot (55).png) |

---

## ✨ Key Features

### 1. ⚙️ Dynamic Master Configuration
*   **Centralized Control:** Admins can configure Departments, Designations, Religions, and Countries dynamically.
*   **Relational Logic:** Designations are linked to Departments. (e.g., Selecting "IT" only shows IT-related roles).
*   **CRUD Operations:** Full ability to Add, View, and Delete master data with safety checks.

### 2. 👤 Smart Employee Onboarding
*   **Cascading Dropdowns:** The "Designation" dropdown updates automatically based on the selected "Department."
*   **Real-Time Validation:** Prevents duplicate entries (Email/Code) before hitting the server.
*   **Live Database Integration:** Dropdowns are populated directly from the Master tables, not hardcoded.

### 3. 💰 Advanced Payroll Module
*   **Dynamic UI:** Add/Remove salary components (Basic, HRA, TA) dynamically.
*   **Smart Caching:** Implements a "Memory System" that retains values typed for specific components even if the user switches context.
*   **Auto-Calculation:** Real-time total calculation with custom CSS-styled currency symbols (AED).
*   **Historical Data:** Loads existing salary structures automatically when an employee is selected.

### 4. 📊 Reporting & Search
*   **Global Search:** Find employees by Name or Code instantly.
*   **PDF Export:** Generate professional PDF reports of employee lists.
*   **Print Optimization:** Custom `@media print` CSS to strip UI elements and format tables for physical printing.

---

## 🛠️ Technical Architecture

*   **Frontend:** React (Hooks, Functional Components), TypeScript, Axios, Bootstrap 5.
*   **Backend:** Node.js, Express (RESTful API), `pg` library for SQL connection.
*   **Database:** PostgreSQL (Relational Data, Foreign Keys, Constraints).

---

## 🚀 How to Run Locally

### 1. Clone the Repository
```bash
git clone https://github.com/Abdulaksha/Your-Repo-Name.git
cd Your-Repo-Name


-- Create Master Tables
CREATE TABLE departments (id SERIAL PRIMARY KEY, name VARCHAR(100));
CREATE TABLE religions (id SERIAL PRIMARY KEY, name VARCHAR(100));
CREATE TABLE countries (id SERIAL PRIMARY KEY, name VARCHAR(100));

-- Create Designation Table (Linked to Dept)
CREATE TABLE designations (
    id SERIAL PRIMARY KEY, 
    name VARCHAR(100), 
    dept_name VARCHAR(100)
);

-- Create Employee Table
CREATE TABLE employees (
    emp_id SERIAL PRIMARY KEY,
    name VARCHAR(255),
    code VARCHAR(50) UNIQUE,
    department VARCHAR(100),
    role VARCHAR(100),
    email VARCHAR(255) UNIQUE,
    doj DATE,
    religion VARCHAR(100),
    country VARCHAR(100)
);

-- Create Salary Table
CREATE TABLE salary_details (
    id SERIAL PRIMARY KEY,
    emp_code VARCHAR(50),
    comp_code VARCHAR(20),
    comp_name VARCHAR(100),
    amount DECIMAL(10,2)
);



# Navigate to backend folder (root)
npm install
npm run dev
# Server runs on http://localhost:5000

# Navigate to frontend folder (if separate)
cd src # or wherever your react files are
npm install
npm start
# App runs on http://localhost:3000

