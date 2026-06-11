# Team Leave Calendar

A full-stack web application for managing team leave requests and on-call rotations.

---

## Tech Stack

**Backend:** Java 21, Spring Boot, Spring Data JPA, H2 (in-memory), Swagger/OpenAPI

**Frontend:** React, Vite, MUI, Axios, react-hot-toast, @mui/x-date-pickers

---

## Prerequisites

- Java 21+
- Node.js 18+
- npm

---

## Running Locally

### Backend

```bash
cd leave-calendar-backend
./mvnw spring-boot:run
```

Runs on: `http://localhost:8080`

Swagger UI: `http://localhost:8080/swagger-ui.html`

H2 Console: `http://localhost:8080/h2-console`
- JDBC URL: `jdbc:h2:mem:leavecalendardb`
- Username: `sa`
- Password: *(empty)*

### Frontend

```bash
cd leave-calendar-frontend
npm install
npm run dev
```

Runs on: `http://localhost:5173`

---

## Running with Docker

```bash
docker-compose up --build
```

- Frontend: `http://localhost:80`
- Backend: `http://localhost:8080`
- Swagger UI: `http://localhost:8080/swagger-ui.html`

To stop:

```bash
docker-compose down
```

---

## Features

### Core
- Create leave requests with team member, start/end date, reason
- View all leave requests in a list with filtering by member and status
- Approve / Reject / Delete leave requests
- Overlap prevention — duplicate leave requests for the same person are blocked (409)
- Weekly on-call rotation schedule (Alice → Bob → Charlie → Diana → repeat)
- Conflict highlighting when the on-call person has approved leave that week
- Calendar month view showing leave requests and on-call weeks visually

### Optional improvements implemented
- Calendar month view with color-coded leave status and on-call highlighting
- Filtering by team member and status
- Docker setup (docker-compose)
- REST API documentation via Swagger UI

---

## Assumptions

- Team members are fixed (Alice, Bob, Charlie, Diana) and seeded on startup — no user registration required
- The on-call rotation anchor date is `2024-01-01` (first Monday of 2024), configurable via `app.oncall.anchor-date` in `application.properties`
- Overlap check applies to all statuses (including Pending) — a new request cannot be created if any existing request overlaps, regardless of status
- A Rejected leave request cannot be changed to Approved or Pending
- Data is stored in-memory (H2) and resets on restart — this is intentional for easy local setup

---

## Not implemented

- Automated tests
- Automatic on-call reassignment suggestion when a conflict is detected
- Comments on leave requests

---

## Project Structure

```
team-leave-calendar/
├── docker-compose.yml
├── leave-calendar-backend/
│   ├── src/main/java/com/simon/leave_calendar_backend/
│   │   ├── controller/       # REST controllers
│   │   ├── service/          # Business logic
│   │   ├── repository/       # JPA repositories
│   │   ├── model/            # JPA entities
│   │   ├── dto/              # Request/Response DTOs
│   │   ├── converter/        # Entity ↔ DTO conversion
│   │   └── exception/        # Custom exceptions + GlobalExceptionHandler
│   └── Dockerfile
└── leave-calendar-frontend/
    ├── src/
    │   ├── api/              # Axios API calls
    │   ├── contexts/         # React Context + Provider
    │   ├── hooks/            # useLeaveCalendar hook
    │   ├── components/       # Reusable UI components
    │   └── pages/            # Page-level components
    ├── Dockerfile
    └── nginx.conf
```
