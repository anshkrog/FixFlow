# 🏢 FixFlow – Smart Residential Complaint & Maintenance Management System

FixFlow is a full-stack residential complaint and maintenance management platform designed to help apartments, hostels, housing societies, and residential communities efficiently report, prioritize, assign, track, and resolve maintenance issues.

The system provides dedicated functionality for **Residents, Maintenance Staff, and Administrators**, allowing the complete complaint lifecycle to be managed through a centralized digital platform.

---

## 📌 Overview

Maintenance complaints in residential communities are often managed through phone calls, WhatsApp groups, registers, or verbal communication.

These methods can lead to:

- Lost or forgotten complaints
- Delayed maintenance
- Lack of complaint tracking
- Poor communication
- No clear staff accountability
- Difficulty identifying urgent issues
- No centralized complaint history
- Difficulty analyzing recurring maintenance problems

**FixFlow** provides a structured digital workflow where every complaint can be reported, prioritized, assigned, tracked, updated, and resolved.

---

# 🎯 Problem Statement

Traditional complaint-management processes used in residential communities often lack transparency, prioritization, accountability, and centralized tracking.

For example, a resident may report:

> "Water leakage in Block A"

through a phone call or messaging group.

However, there may be no reliable way to determine:

- When the complaint was reported
- How urgent the issue is
- Which staff member is responsible
- Whether work has started
- How long resolution took
- Whether the same issue occurred previously

FixFlow addresses these limitations by providing a centralized complaint and maintenance management system.

---

# 💡 Proposed Solution

FixFlow provides a role-based platform through which:

### Residents can

- Create an account
- Securely log in
- Submit maintenance complaints
- Select complaint categories
- Provide complaint descriptions
- Track complaint status
- Monitor complaint progress
- View previous complaints

### Maintenance Staff can

- Securely log in
- View assigned complaints
- View complaint priority
- Update work status
- Manage assigned maintenance tasks
- Mark completed issues as resolved

### Administrators can

- Monitor all complaints
- Manage users
- Assign complaints to maintenance staff
- Monitor complaint priorities
- Track staff workload
- Monitor complaint resolution
- View maintenance activity and analytics

---

# ⭐ Key Features

## 🔐 Secure Authentication

FixFlow provides secure authentication using:

- Spring Security
- BCrypt password hashing
- JSON Web Tokens (JWT)
- Role-based authorization

Passwords are never stored as plain text.

After successful authentication, a JWT is generated and used to access protected API endpoints.

---

## 👥 Role-Based Access Control

The system supports three primary user roles:

```text
RESIDENT
STAFF
ADMIN
```

Each role has different permissions.

### RESIDENT

Residents can:

- Submit complaints
- View their complaints
- Track complaint status
- View complaint history
- Monitor maintenance progress

### STAFF

Maintenance staff can:

- View assigned complaints
- View complaint details
- Update complaint progress
- Change maintenance status
- Mark assigned issues as resolved

### ADMIN

Administrators can:

- View all complaints
- Manage complaint assignments
- Manage users
- Manage staff
- Monitor complaint priorities
- Track system activity
- View maintenance analytics

---

# 📝 Complaint Management

Residents can create complaints containing information such as:

- Complaint title
- Description
- Category
- Location
- Date reported
- Priority
- Current status

Each complaint receives a unique identifier that can be used throughout its lifecycle.

---

# 🧠 Smart Complaint Prioritization

FixFlow includes a complaint-prioritization mechanism to help important maintenance issues receive attention before less critical requests.

Priority can be determined using factors such as:

- Complaint category
- Severity
- Urgency
- Waiting time
- Repeated complaints
- Potential impact

Complaints can then be classified into priority levels such as:

```text
LOW
MEDIUM
HIGH
CRITICAL
```

This helps administrators and maintenance staff focus on urgent problems first.

---

# 🔄 Complaint Lifecycle

A typical complaint follows a structured workflow:

```text
Resident
   │
   ▼
Complaint Submitted
   │
   ▼
Complaint Categorized
   │
   ▼
Priority Determined
   │
   ▼
Administrator Review
   │
   ▼
Staff Assigned
   │
   ▼
Work Started
   │
   ▼
Status Updated
   │
   ▼
Issue Resolved
   │
   ▼
Complaint Closed
```

---

# 📊 Complaint Status Tracking

Complaints can move through statuses such as:

```text
OPEN
ASSIGNED
IN_PROGRESS
RESOLVED
CLOSED
```

This gives residents visibility into the progress of their maintenance requests.

---

# 👨‍🔧 Staff Assignment

Administrators can assign maintenance requests to appropriate staff members.

Assignment information can include:

- Complaint
- Assigned staff member
- Assignment date
- Current status
- Completion information

This improves accountability because each maintenance request has a responsible staff member.

---

# 📜 Complaint History

FixFlow maintains historical information about complaints and their status changes.

This can help answer questions such as:

- When was the complaint created?
- When was staff assigned?
- When did work begin?
- When was the complaint resolved?
- How long did resolution take?

Complaint history also helps identify recurring maintenance issues.

---

# 📊 Dashboard

FixFlow provides role-specific dashboards.

## Resident Dashboard

The resident dashboard displays:

- Total complaints
- Open complaints
- In-progress complaints
- Resolved complaints
- Recent complaints
- Complaint status
- Quick Report Issue option

## Staff Dashboard

The staff dashboard displays:

- Assigned complaints
- Pending tasks
- High-priority complaints
- In-progress maintenance
- Completed tasks

## Admin Dashboard

The administrator dashboard displays:

- Total complaints
- Open complaints
- Critical complaints
- Resolved complaints
- Staff workload
- Complaint categories
- Priority distribution
- Resolution statistics

---

# 🏗️ System Architecture

FixFlow follows a modern full-stack layered architecture.

```text
                 ┌───────────────────────┐
                 │       USER            │
                 └───────────┬───────────┘
                             │
                             ▼
                 ┌───────────────────────┐
                 │    React Frontend     │
                 │ HTML / CSS / JS       │
                 └───────────┬───────────┘
                             │
                         REST API
                             │
                             ▼
              ┌──────────────────────────────┐
              │      Spring Boot Backend     │
              ├──────────────────────────────┤
              │ Controllers                  │
              │ DTOs                         │
              │ Services                     │
              │ Security                     │
              │ Repositories                 │
              │ Entities                     │
              └──────────────┬───────────────┘
                             │
                       Spring Data JPA
                             │
                             ▼
                 ┌───────────────────────┐
                 │        MySQL          │
                 │      Database         │
                 └───────────────────────┘
```

---

# 🔧 Backend Architecture

The Spring Boot backend follows a layered architecture:

```text
HTTP Request
     │
     ▼
Controller
     │
     ▼
DTO
     │
     ▼
Service
     │
     ▼
Repository
     │
     ▼
JPA / Hibernate
     │
     ▼
MySQL
```

### Controller Layer

Handles incoming REST API requests and sends HTTP responses.

### DTO Layer

Controls the data transferred between the client and backend.

DTOs prevent unnecessary or sensitive entity information from being exposed.

### Service Layer

Contains business logic such as:

- User registration
- Authentication
- Complaint processing
- Priority calculations
- Staff assignment
- Status management

### Repository Layer

Uses Spring Data JPA to communicate with the database.

### Entity Layer

Maps Java objects to relational database tables using JPA/Hibernate.

---

# 🔐 Authentication Architecture

FixFlow uses JWT-based stateless authentication.

```text
User
 │
 │ Email + Password
 ▼
Login API
 │
 ▼
UserService
 │
 ▼
Database User Lookup
 │
 ▼
BCrypt Password Verification
 │
 ▼
JWT Generation
 │
 ▼
JWT Returned to Frontend
```

For protected requests:

```text
React
 │
 │ Authorization:
 │ Bearer <JWT>
 ▼
JWT Authentication Filter
 │
 ▼
Validate Token
 │
 ▼
Extract User Identity
 │
 ▼
Spring Security Context
 │
 ▼
Authorization Check
 │
 ▼
Protected Controller
```

---

# 🔑 Password Security

Passwords are protected using BCrypt.

Example:

```text
User password:

password123

        ↓

BCrypt

        ↓

$2a$10$xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

Only the BCrypt hash is stored in MySQL.

During login, the entered password is verified against the stored hash.

The original password is never retrieved from the database.

---

# 🎟️ JWT Authentication

After successful login, the backend generates a JSON Web Token.

Example response:

```json
{
  "id": 3,
  "name": "Ansh Kumar",
  "email": "user@example.com",
  "role": "RESIDENT",
  "token": "eyJhbGciOiJIUzI1NiJ9...",
  "message": "Login successful"
}
```

The frontend sends the token with protected requests:

```text
Authorization: Bearer <JWT_TOKEN>
```

Spring Security validates the token before allowing access.

---

# 🌐 REST API Design

Example authentication endpoints:

```http
POST /api/auth/register
POST /api/auth/login
```

Example complaint endpoints:

```http
POST   /api/complaints
GET    /api/complaints
GET    /api/complaints/{id}
PUT    /api/complaints/{id}
DELETE /api/complaints/{id}
```

Example resident endpoint:

```http
GET /api/complaints/my
```

Example staff endpoints:

```http
GET /api/staff/complaints
PUT /api/staff/complaints/{id}/status
```

Example admin endpoints:

```http
GET /api/admin/complaints
PUT /api/admin/complaints/{id}/assign
GET /api/admin/users
GET /api/admin/dashboard
```

---

# 🗄️ Database Design

FixFlow uses **MySQL** as its relational database.

Major database entities include:

```text
Users
Complaints
Categories
Assignments
Complaint History
Priority Information
```

Relationships between these entities allow the complete complaint lifecycle to be maintained.

---

# 👤 User Entity

Example user information:

```text
id
name
email
password
phone
role
created_at
updated_at
```

The email is unique and passwords are stored as BCrypt hashes.

---

# 🛠️ Technology Stack

## Frontend

- React.js
- JavaScript
- HTML5
- CSS3
- Responsive UI

## Backend

- Java
- Spring Boot
- Spring MVC
- Spring Security
- Spring Data JPA
- Hibernate

## Database

- MySQL

## Authentication & Security

- JWT
- Spring Security
- BCrypt
- Role-Based Access Control

## API

- RESTful APIs
- JSON

## Build Tool

- Maven

## Testing & Development Tools

- Postman
- IntelliJ IDEA

## Version Control

- Git
- GitHub

---

# 📂 Project Structure

```text
FixFlow/
│
├── backend/
│   │
│   ├── src/main/java/fixflow_backend/
│   │   │
│   │   ├── config/
│   │   │
│   │   ├── controller/
│   │   │
│   │   ├── dto/
│   │   │
│   │   ├── entity/
│   │   │
│   │   ├── exception/
│   │   │
│   │   ├── repository/
│   │   │
│   │   ├── security/
│   │   │
│   │   ├── service/
│   │   │
│   │   └── BackendApplication.java
│   │   │
│   │   └── resources/
│   │       └── application.properties
│   │
│   └── pom.xml
│
├── frontend/
│   │
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── context/
│   │   └── assets/
│   │
│   └── package.json
│
└── README.md
```

---

# 🧪 API Testing

Postman is used to test backend APIs independently from the frontend.

Testing includes:

- Registration
- Login
- Input validation
- Incorrect credentials
- JWT generation
- JWT validation
- Protected endpoints
- Role authorization
- Complaint creation
- Complaint retrieval
- Complaint updates
- Staff assignment

---

# ⚠️ Error Handling

FixFlow provides structured API error responses.

For example, invalid login credentials return:

```json
{
  "message": "Invalid email or password"
}
```

with:

```text
HTTP 401 Unauthorized
```

Validation and business errors are handled centrally to keep API responses consistent.

---

# 🖥️ User Interface

FixFlow provides a modern responsive interface designed for desktop and mobile devices.

The UI includes:

- Authentication screens
- Navigation sidebar
- Dashboard statistics
- Complaint cards
- Status badges
- Priority indicators
- Complaint forms
- Complaint timeline
- Tables and filters
- Staff assignment interface
- Administrative analytics

---

# 🚀 Deployment Architecture

The production application follows:

```text
                Internet
                   │
                   ▼
          ┌─────────────────┐
          │ React Frontend  │
          └────────┬────────┘
                   │
                HTTPS
                   │
                   ▼
          ┌─────────────────┐
          │ Spring Boot API │
          └────────┬────────┘
                   │
                   ▼
          ┌─────────────────┐
          │ MySQL Database  │
          └─────────────────┘
```

Sensitive configuration such as:

```text
Database credentials
JWT secret keys
Production configuration
```

is managed using environment variables rather than being committed directly to the source repository.

---

# ▶️ Running the Project Locally

## Prerequisites

Install:

```text
Java
Maven
MySQL
Node.js
npm
Git
```

---

## 1. Clone Repository

```bash
git clone <repository-url>
```

```bash
cd FixFlow
```

---

## 2. Configure MySQL

Create the database:

```sql
CREATE DATABASE fixflow;
```

Configure the required database environment variables.

---

## 3. Start Backend

```bash
cd backend
```

```bash
mvn spring-boot:run
```

The backend runs on:

```text
http://localhost:8080
```

---

## 4. Start Frontend

Open another terminal:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Start the application:

```bash
npm run dev
```

Open the frontend URL displayed by the development server.

---

# 🔒 Security Practices

FixFlow follows several application-security practices:

- Password hashing using BCrypt
- JWT-based authentication
- Protected backend endpoints
- Role-based authorization
- DTO-based API responses
- Input validation
- Centralized exception handling
- Unique user emails
- Environment-based secrets
- Separation of authentication and authorization

---

# 💼 Real-World Use Cases

FixFlow can be adapted for:

- Apartment societies
- Residential complexes
- University hostels
- PG accommodations
- Campus maintenance
- Housing communities
- Facility-management organizations

---

# 🚀 Future Enhancements

Future versions can include:

- Complaint image uploads
- Email notifications
- Push notifications
- Real-time status updates
- WebSocket communication
- Automated escalation
- SLA tracking
- Advanced analytics
- Staff performance analytics
- Recurring issue detection
- Mobile application
- AI-assisted complaint categorization
- AI-based priority recommendations

---

# 🎯 Project Objectives

The primary objectives of FixFlow are to:

1. Digitize residential complaint management.
2. Provide transparent complaint tracking.
3. Improve accountability among maintenance staff.
4. Prioritize critical maintenance problems.
5. Provide role-specific functionality.
6. Maintain historical maintenance records.
7. Improve communication between residents and management.
8. Provide administrators with useful operational insights.

---

# 📈 Benefits

FixFlow provides:

- Centralized complaint management
- Improved transparency
- Better accountability
- Faster complaint resolution
- Structured maintenance workflows
- Secure authentication
- Priority-based issue handling
- Historical maintenance records
- Administrative monitoring
- Data-driven decision making

---

# 🎓 Concepts Demonstrated

This project demonstrates practical knowledge of:

- Java
- Object-Oriented Programming
- Spring Boot
- Spring MVC
- Spring Security
- REST API development
- Spring Data JPA
- Hibernate
- MySQL
- React.js
- Full-stack development
- JWT authentication
- BCrypt password hashing
- Role-Based Access Control
- DTO design
- Layered architecture
- Exception handling
- API testing
- Database design
- Git/GitHub
- Application deployment

---

# 👨‍💻 Developer

**Ansh Kumar**

B.Tech Computer Science & Engineering  
Galgotias University

---

# 📄 Project Purpose

FixFlow was developed as a full-stack software engineering project to solve real-world maintenance and complaint-management challenges while demonstrating modern web development, backend architecture, database design, API security, and deployment practices.
