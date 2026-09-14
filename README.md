# FixFlow

### Smart Civic Complaint & Maintenance Management System

FixFlow is a full-stack web application designed to simplify the process of reporting, managing, assigning, and resolving civic and facility-related complaints.

The system provides dedicated workspaces for **Residents, Administrators, and Field Staff**, allowing a complaint to move through a complete workflow — from initial reporting to final resolution.

---

## Project Overview

Traditional complaint-management processes often lack transparency, structured prioritization, and clear responsibility assignment.

FixFlow provides a centralized platform where:

- Residents can report civic issues and monitor their complaints.
- Administrators can review complaints, set priorities, and assign field staff.
- Staff members can view assigned tasks and update their progress.
- Complaint status is tracked throughout its lifecycle.

The application uses a React frontend, Spring Boot REST API, MySQL database, and JWT-based authentication.

---

## Screenshots

### Resident Issue Reporting

Residents can select an issue category, provide complaint details and submit civic problems directly to the system.

![FixFlow Report Issue](docs/screenshots/report-issue.png)

### Admin Complaint Management

Administrators can monitor complaints, filter the complaint queue, change priorities and assign staff members.

![FixFlow Admin Dashboard](docs/screenshots/admin-dashboard.png)

### Staff Field Workspace

Assigned staff can view their work queue and move complaints through the resolution workflow.

![FixFlow Staff Dashboard](docs/screenshots/staff-dashboard.png)

---

## Core Features

### Resident

- Secure account registration and login
- Submit civic complaints
- Select complaint categories
- Provide issue title, description and location
- View personal complaint history
- Track complaint status
- View complaint priority
- View assigned staff information
- Complaint lifecycle visualization
- Responsive resident dashboard

### Administrator

- Secure admin dashboard
- View all submitted complaints
- Search complaints
- Filter complaints by status
- Filter complaints by priority
- Set complaint priority
- Assign field staff
- Monitor active work
- Monitor resolved complaints
- View operational statistics

### Field Staff

- Secure staff workspace
- View assigned complaints
- Search assigned tasks
- View complaint priority and location
- Start assigned work
- Update complaint status
- Mark completed work as resolved
- Monitor personal task statistics

---

## Complaint Workflow

```text
Resident
   │
   │ Reports issue
   ▼
 OPEN
   │
   │ Admin reviews complaint
   │ Sets priority
   │ Assigns staff
   ▼
 ASSIGNED
   │
   │ Staff begins work
   ▼
 IN_PROGRESS
   │
   │ Staff completes work
   ▼
 RESOLVED
```

This provides clear ownership and visibility throughout the complaint lifecycle.

---

## Role-Based Architecture

FixFlow supports three application roles:

| Role | Responsibility |
|------|----------------|
| RESIDENT | Reports and tracks civic issues |
| ADMIN | Prioritizes complaints and assigns staff |
| STAFF | Handles assigned complaints and updates progress |

Authorization is enforced by the Spring Boot backend rather than relying only on frontend route protection.

---

## Technology Stack

### Frontend

- React
- Vite
- JavaScript
- Axios
- React Router
- CSS
- Lucide Icons

### Backend

- Java
- Spring Boot
- Spring Security
- Spring Data JPA
- Hibernate
- REST APIs
- Maven

### Authentication & Security

- JSON Web Tokens (JWT)
- BCrypt password hashing
- Stateless authentication
- Role-based authorization
- Protected REST endpoints
- CORS configuration

### Database

- MySQL

### Development Tools

- IntelliJ IDEA
- Visual Studio Code
- Postman
- Git
- GitHub

---

## System Architecture

```text
┌───────────────────────────────┐
│          React + Vite         │
│                               │
│ Resident │ Admin │ Staff      │
└───────────────┬───────────────┘
                │
                │ HTTPS / REST API
                │ JWT Bearer Token
                ▼
┌───────────────────────────────┐
│       Spring Boot Backend     │
│                               │
│ Controllers                   │
│ Services                      │
│ Spring Security + JWT         │
│ Spring Data JPA               │
└───────────────┬───────────────┘
                │
                │ JPA / Hibernate
                ▼
┌───────────────────────────────┐
│             MySQL             │
│                               │
│ Users                         │
│ Complaints                    │
└───────────────────────────────┘
```

---

## Project Structure

```text
FixFlow/
│
├── backend/
│   ├── src/main/java/fixflow_backend/
│   │   ├── config/
│   │   ├── controller/
│   │   ├── dto/
│   │   ├── entity/
│   │   ├── exception/
│   │   ├── repository/
│   │   ├── security/
│   │   └── service/
│   │
│   ├── src/main/resources/
│   │   └── application.properties
│   │
│   └── pom.xml
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── App.jsx
│   │   └── index.css
│   │
│   ├── package.json
│   └── vite.config.js
│
├── docs/
│   └── screenshots/
│
├── .gitignore
└── README.md
```

---

## Authentication Flow

When a user logs in:

1. The frontend sends the login credentials to the authentication API.
2. The backend verifies the password using BCrypt.
3. A signed JWT is generated after successful authentication.
4. The frontend stores the authentication information.
5. Axios attaches the JWT to protected API requests.

Protected requests use:

```text
Authorization: Bearer <JWT>
```

The backend validates the token before allowing access to protected resources.

---

## REST API Overview

### Authentication

```http
POST /api/auth/register
POST /api/auth/login
```

### Resident Complaints

```http
POST /api/complaints
GET  /api/complaints/my
GET  /api/complaints/{id}
```

### Administrator

```http
GET   /api/admin/complaints
GET   /api/admin/staff
PATCH /api/admin/complaints/{id}/priority
PATCH /api/admin/complaints/{id}/assign
```

### Staff

```http
GET   /api/staff/complaints
PATCH /api/staff/complaints/{id}/status
```

---

## Environment Variables

Sensitive configuration is not stored directly in the source code.

### Backend

The backend requires:

```text
DB_USERNAME
DB_PASSWORD
JWT_SECRET
FRONTEND_URL
```

For production deployment, the database URL should also be configured using an environment variable.

Example:

```properties
spring.datasource.url=${DB_URL}
spring.datasource.username=${DB_USERNAME}
spring.datasource.password=${DB_PASSWORD}

jwt.secret=${JWT_SECRET}

app.cors.allowed-origin=${FRONTEND_URL}
```

Never commit real passwords or JWT secrets to the repository.

### Frontend

The deployed frontend can configure the backend address using:

```text
VITE_API_BASE_URL
```

Example:

```text
VITE_API_BASE_URL=https://your-backend-domain.example/api
```

---

## Running FixFlow Locally

### Prerequisites

Install:

- Java
- Maven
- Node.js
- npm
- MySQL
- Git

### 1. Clone the Repository

```bash
git clone https://github.com/anshkrog/FixFlow.git
cd FixFlow
```

### 2. Create the Database

Create a MySQL database:

```sql
CREATE DATABASE fixflow;
```

### 3. Configure Backend Environment Variables

Configure the following values in your local environment:

```text
DB_USERNAME
DB_PASSWORD
JWT_SECRET
```

`JWT_SECRET` should be a strong Base64-encoded signing key.

### 4. Start the Backend

```bash
cd backend
./mvnw spring-boot:run
```

On Windows PowerShell:

```powershell
cd backend
.\mvnw.cmd spring-boot:run
```

The backend runs locally on:

```text
http://localhost:8080
```

### 5. Start the Frontend

Open another terminal:

```bash
cd frontend
npm install
npm run dev
```

The frontend runs locally on:

```text
http://localhost:5173
```

---

## Security Considerations

FixFlow implements several backend security measures:

- BCrypt password hashing
- JWT authentication
- Stateless Spring Security configuration
- Backend role-based authorization
- Resident complaint ownership validation
- Environment-based secret configuration
- Configurable CORS origin
- Protected administrative and staff operations

Public registration should only create resident accounts. Administrative and staff roles should not be assignable through public registration.

---

## Responsive Design

The FixFlow interface is designed for desktop and mobile usage.

The dashboards adapt their:

- Navigation
- Summary cards
- Complaint queues
- Search controls
- Action panels
- Forms

for smaller screen sizes.

---

## Future Enhancements

Possible extensions include:

- Complaint image uploads
- Email notifications
- SMS notifications
- Map-based issue location
- Administrative analytics
- SLA monitoring
- Complaint escalation
- Multiple staff teams
- Audit history
- Cloud file storage
- AI-assisted complaint categorization and prioritization

---

## Author

**Ansh Kumar**

B.Tech Computer Science & Engineering

GitHub: [anshkrog](https://github.com/anshkrog)

---

## Project Status

**Core application completed.**

FixFlow currently supports the complete complaint lifecycle across Resident, Administrator and Staff roles. Production deployment configuration is the next stage.